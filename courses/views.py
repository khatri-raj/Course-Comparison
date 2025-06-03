from django.shortcuts import render, redirect
from .models import Course, Review, ContactMessage, SavedCourse
from .forms import ContactMessageForm, UserUpdateForm, CustomPasswordChangeForm
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from .serializers import CourseSerializer, ReviewSerializer, ContactMessageSerializer, UserRegistrationSerializer, UserUpdateSerializer, SavedCourseSerializer
from rest_framework.decorators import action

def home(request):
    top_courses = Course.objects.order_by('-Rating')[:3]
    return render(request, 'home.html', {'top_courses': top_courses})

def show_courses(request):
    courses = Course.objects.all()
    return render(request, 'show_courses.html', {'courses': courses})

@login_required
def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})

def contact(request):
    form = ContactMessageForm()
    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.warning(request, "You must be logged in to submit the form.")
            return render(request, 'contact.html', {'form': form})
        else:
            form = ContactMessageForm(request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, "Your message has been sent successfully!")
                form = ContactMessageForm()
                return render(request, 'contact.html', {'form': form, 'success': True})
            else:
                print(form.errors)
    return render(request, 'contact.html', {'form': form})

def help(request):
    return render(request, 'help.html')

def reviews_list(request):
    courses = Course.objects.all()
    if request.method == "POST":
        if not request.user.is_authenticated:
            messages.warning(request, "You must be logged in to submit a review.")
            return redirect('reviews_list')
        course_id = request.POST.get('course')
        rating = float(request.POST.get('rating'))
        comment = request.POST.get('comment')
        course = Course.objects.get(id=course_id)
        Review.objects.create(course=course, rating=rating, comment=comment, user=request.user)
        messages.success(request, "Review added successfully!")
        return redirect('reviews_list')
    return render(request, 'reviews_list.html', {'courses': courses})

def review(request):
    reviews = Review.objects.all()
    return render(request, 'review.html', {'reviews': reviews})

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            messages.success(request, f"Welcome back, {username}!")
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password.")
            return redirect('login')
    return render(request, 'login.html')

def logout(request):
    auth_logout(request)
    messages.success(request, "You have logged out successfully.")
    return redirect('login')

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        if password1 != password2:
            messages.error(request, "Passwords do not match.")
            return redirect('register')
        elif User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken.")
            return redirect('register')
        elif User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered.")
            return redirect('register')
        user = User.objects.create_user(username=username, email=email, password=password1)
        user.save()
        messages.success(request, "Registration successful! You can now login.")
        return redirect('login')
    return render(request, 'register.html')

@login_required
def save_course(request, course_id):
    course = Course.objects.get(id=course_id)
    saved, created = SavedCourse.objects.get_or_create(user=request.user, course=course)
    if created:
        messages.success(request, "Course saved to your dashboard!")
    else:
        messages.info(request, "Course already in your dashboard.")
    return redirect('show_courses')

@login_required
def remove_saved_course(request, course_id):
    if request.method == "POST":
        saved_course = get_object_or_404(SavedCourse, user=request.user, course_id=course_id)
        saved_course.delete()
        messages.success(request, "Course removed from your dashboard.")
    return redirect('dashboard')

@login_required
def dashboard(request):
    saved_courses = SavedCourse.objects.filter(user=request.user).select_related('course')
    return render(request, 'dashboard.html', {'saved_courses': saved_courses})

@login_required
def profile_update(request):
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=request.user)
        password_form = CustomPasswordChangeForm(user=request.user, data=request.POST)
        if user_form.is_valid():
            if 'old_password' in request.POST and request.POST['old_password'].strip():
                if password_form.is_valid():
                    user_form.save()
                    password_form.save()
                    update_session_auth_hash(request, password_form.user)
                    messages.success(request, "Profile and password updated successfully!")
                    return redirect('profile_update')
                else:
                    messages.error(request, "Please correct the errors in the password form.")
            else:
                user_form.save()
                messages.success(request, "Profile updated successfully!")
                return redirect('profile_update')
        else:
            messages.error(request, "Please correct the errors in the profile form.")
    else:
        user_form = UserUpdateForm(instance=request.user)
        password_form = CustomPasswordChangeForm(user=request.user)
    return render(request, 'profile_update.html', {
        'user_form': user_form,
        'password_form': password_form,
    })

# API Views
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-course/(?P<course_id>\d+)')
    def by_course(self, request, course_id=None):
        reviews = self.queryset.filter(course_id=course_id)
        serializer = self.serializer_class(reviews, many=True)
        return Response(serializer.data)

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UpdateProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'username': self.get_object().username,
            'email': self.get_object().email,
        })

class SavedCourseViewSet(viewsets.ModelViewSet):
    queryset = SavedCourse.objects.all()  # Default queryset
    serializer_class = SavedCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedCourse.objects.filter(user=self.request.user).select_related('course')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        obj = get_object_or_404(SavedCourse, id=self.kwargs['pk'], user=self.request.user)
        return obj
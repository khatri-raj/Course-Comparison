from django.shortcuts import render, redirect
from .models import Course, Review
from .forms import ContactMessageForm

def home(request):
    return render(request, 'home.html')

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})

def contact(request):
    if request.method == 'POST':
        form = ContactMessageForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'contact.html', {
                'form': ContactMessageForm(),
                'success': True
            })
    else:
        form = ContactMessageForm()
    
    return render(request, 'contact.html', {'form': form})

def help(request):
    return render(request, 'help.html')

def reviews_list(request):
    # Show review submission form
    courses = Course.objects.all()
    if request.method == "POST":
        course_id = request.POST.get('course')
        rating = float(request.POST.get('rating'))
        comment = request.POST.get('comment')
        course = Course.objects.get(id=course_id)
        Review.objects.create(course=course, rating=rating, comment=comment)
        return redirect('reviews_list')  # Redirect to review list after submission
    return render(request, 'reviews_list.html', {'courses': courses})


def review(request):
    # Show review list
    reviews = Review.objects.all()
    return render(request, 'review.html', {'reviews': reviews})
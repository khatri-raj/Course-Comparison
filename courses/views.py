from django.shortcuts import render, redirect
from .models import Course, Review
from .forms import ContactMessageForm


def home(request):
    return render(request, 'home.html')

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})

# def review(request):
#     # Get all the courses to display in the form
#     courses = Course.objects.all()
#     # Get all reviews to display
#     reviews = Review.objects.all()

#     if request.method == "POST":
#         # Create a new review based on the form data
#         course_id = request.POST.get('course')
#         rating = float(request.POST.get('rating'))
#         comment = request.POST.get('comment')
#         # Save the review to the database
#         course = Course.objects.get(id=course_id)
#         Review.objects.create(course=course, rating=rating, comment=comment)
#         # Redirect to the same page after submitting the review
#         return redirect('reviews_list')
#     return render(request, 'review.html', {'courses': courses, 'reviews': reviews})

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

# def reviews_list(request):
#     # Get all reviews to display
#     reviews = Review.objects.all()
#     return render(request, 'reviews_list.html', {'reviews': reviews})

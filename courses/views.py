from django.shortcuts import render
from .models import Course

def home(request):
    return render(request, 'home.html')

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})


def review(request):
    return render(request, 'review.html')

def contact(request):
    return render(request, 'contact.html')

def help(request):
    return render(request, 'help.html')

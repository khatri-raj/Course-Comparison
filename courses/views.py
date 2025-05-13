from django.shortcuts import render
from .models import Course
from .forms import ContactMessageForm


def home(request):
    return render(request, 'home.html')

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})


def review(request):
    return render(request, 'review.html')

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

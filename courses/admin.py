from django.contrib import admin
from .models import Course,ContactMessage,Review

admin.site.register(Course)
admin.site.register(ContactMessage)
admin.site.register(Review)
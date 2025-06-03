from django.contrib import admin
from .models import Course,ContactMessage,Review
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

admin.site.register(Course)
admin.site.register(ContactMessage)
admin.site.register(Review)
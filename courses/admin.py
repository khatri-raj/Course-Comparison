from django.contrib import admin
from .models import Course, ContactMessage, Review, SavedCourse
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html

# Customize User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# ContactMessage Admin with filters
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'submitted_at')
    list_filter = ('submitted_at',)  # Add more fields if needed
    search_fields = ('name', 'email', 'subject')

# Review Admin with filters
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating', 'created_at')
    list_filter = ('course', 'user', 'rating', 'created_at')
    search_fields = ('course__Name', 'user__username', 'comment')

# Course Admin
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('Name', 'Institute', 'Rating', 'image_tag')
    list_filter = ('Institute',)
    search_fields = ('Name', 'Institute')

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No Image"
    image_tag.short_description = 'Image'

# Optionally register SavedCourse model too
@admin.register(SavedCourse)
class SavedCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'saved_at')
    list_filter = ('saved_at',)
    search_fields = ('user__username', 'course__Name')

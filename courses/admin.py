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
admin.site.register(ContactMessage)
admin.site.register(Review)
# admin.site.register(Course)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('Name', 'Institute', 'Rating', 'image')
    list_filter = ('Institute',)
    search_fields = ('Name', 'Institute')

    def image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No Image"
    image.allow_tags = True
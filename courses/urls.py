from django.urls import path
from .views import course_list
from .import views

urlpatterns = [
    path('',views.home, name="home"),
    path('courses/', views.show_courses, name='show_courses'),
    path('Compare/', views.course_list, name='course_list'),
    path('review/', views.review, name="review"),
    path('contact/',views.contact, name="contact"),
    path('help/', views.help, name="help"),
    path('reviews_list/', views.reviews_list, name="reviews_list"),
    path('login/', views.login, name='login'),
    path('logout/',views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('save_course/<int:course_id>/', views.save_course, name='save_course'),
    path('remove_saved_course/<int:course_id>/', views.remove_saved_course, name='remove_saved_course'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/', views.profile_update, name='profile_update'),
]

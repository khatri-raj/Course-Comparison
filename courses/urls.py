from django.urls import path
from .views import course_list
from .import views

urlpatterns = [
    path('',views.home, name="home"),
    path('Compare/', views.course_list, name='course_list'),
    path('review/', views.review, name="review"),
    path('contact/',views.contact, name="contact"),
    path('help/', views.help, name="help"),
    path('reviews_list/', views.reviews_list, name="reviews_list"),
    path('login/', views.login, name='login'),
    path('logout/',views.logout, name='logout'),
    path('register/', views.register, name='register'),
]

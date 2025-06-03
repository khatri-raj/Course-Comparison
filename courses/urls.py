from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CourseViewSet, ReviewViewSet, ContactMessageViewSet, RegisterView, UpdateProfileView,
    SavedCourseViewSet, home, show_courses, course_list, contact, help, reviews_list,
    review, login, logout, register, save_course, remove_saved_course, dashboard, profile_update
)

router = DefaultRouter()
router.register(r'api/courses', CourseViewSet)
router.register(r'api/reviews', ReviewViewSet)
router.register(r'api/contact-messages', ContactMessageViewSet)
router.register(r'api/saved-courses', SavedCourseViewSet)

urlpatterns = [
    path('', home, name="home"),
    path('courses/', show_courses, name='show_courses'),
    path('Compare/', course_list, name='course_list'),
    path('review/', review, name="review"),
    path('contact/', contact, name="contact"),
    path('help/', help, name="help"),
    path('reviews_list/', reviews_list, name="reviews_list"),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('register/', register, name='register'),
    path('save_course/<int:course_id>/', save_course, name='save_course'),
    path('remove_saved_course/<int:course_id>/', remove_saved_course, name='remove_saved_course'),
    path('dashboard/', dashboard, name='dashboard'),
    path('profile/', profile_update, name='profile_update'),
    path('api/register/', RegisterView.as_view(), name='api_register'),
    path('api/update-profile/', UpdateProfileView.as_view(), name='api_update_profile'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
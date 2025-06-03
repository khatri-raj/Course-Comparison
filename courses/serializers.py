from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Course, Review, ContactMessage, SavedCourse

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already taken."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password_confirm = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if 'password' in data and data['password']:
            if data.get('password') != data.get('password_confirm'):
                raise serializers.ValidationError({"password": "Passwords do not match."})
            if len(data['password']) < 8:
                raise serializers.ValidationError({"password": "Password must be at least 8 characters long."})

        if 'username' in data and data['username']:
            existing_user = User.objects.exclude(id=self.instance.id).filter(username=data['username'])
            if existing_user.exists():
                raise serializers.ValidationError({"username": "Username already taken."})

        if 'email' in data and data['email']:
            existing_email = User.objects.exclude(id=self.instance.id).filter(email=data['email'])
            if existing_email.exists():
                raise serializers.ValidationError({"email": "Email already registered."})

        return data

    def update(self, instance, validated_data):
        validated_data.pop('password_confirm', None)
        if 'password' in validated_data and validated_data['password']:
            instance.set_password(validated_data['password'])
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'course', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class SavedCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source='course', write_only=True
    )

    class Meta:
        model = SavedCourse
        fields = ['id', 'user', 'course', 'course_id', 'saved_at']
        read_only_fields = ['user', 'saved_at']

    def validate(self, data):
        # Ensure the course isn't already saved by the user
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if SavedCourse.objects.filter(user=request.user, course=data['course']).exists():
                raise serializers.ValidationError({"course": "This course is already saved."})
        return data
from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    Name = models.CharField(max_length=200)
    Institute = models.CharField(max_length=200)
    Fees = models.IntegerField()
    Duration = models.CharField(max_length=50)
    Placement_rate = models.FloatField()
    Rating = models.FloatField()
    Syllabus = models.TextField()
    def __str__(self):
        return self.Name
    

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject or 'No Subject'}"
    

class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    rating = models.FloatField()  
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.course.Name} by {self.rating} stars"
    
class SavedCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} saved {self.course.Name}"
from django.db import models

class Course(models.Model):
    Name = models.CharField(max_length=200)
    Institute = models.CharField(max_length=200)
    Fees = models.IntegerField()
    Duration = models.CharField(max_length=50)  # Example: "3 Months"
    Placement_rate = models.FloatField()  # Example: 85.5 (for 85.5%)
    Rating = models.FloatField()  # Example: 4.5 (for 4.5/5)
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
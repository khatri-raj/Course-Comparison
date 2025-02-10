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

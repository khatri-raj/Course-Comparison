# Generated by Django 5.2.1 on 2025-06-05 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_review_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='course_images/'),
        ),
    ]

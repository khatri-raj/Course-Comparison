# Generated by Django 5.2.1 on 2025-05-12 13:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='duration',
            new_name='Duration',
        ),
        migrations.RenameField(
            model_name='course',
            old_name='fees',
            new_name='Fees',
        ),
        migrations.RenameField(
            model_name='course',
            old_name='institute',
            new_name='Institute',
        ),
        migrations.RenameField(
            model_name='course',
            old_name='name',
            new_name='Name',
        ),
        migrations.RenameField(
            model_name='course',
            old_name='placement_rate',
            new_name='Placement_rate',
        ),
        migrations.RenameField(
            model_name='course',
            old_name='rating',
            new_name='Rating',
        ),
        migrations.RenameField(
            model_name='course',
            old_name='syllabus',
            new_name='Syllabus',
        ),
    ]

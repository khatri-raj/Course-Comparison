# Generated by Django 5.1.6 on 2025-02-09 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('institute', models.CharField(max_length=200)),
                ('fees', models.IntegerField()),
                ('duration', models.CharField(max_length=50)),
                ('placement_rate', models.FloatField()),
                ('rating', models.FloatField()),
                ('syllabus', models.TextField()),
            ],
        ),
    ]

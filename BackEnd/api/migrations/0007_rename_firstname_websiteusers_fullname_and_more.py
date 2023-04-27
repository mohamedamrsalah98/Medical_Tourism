# Generated by Django 4.1.7 on 2023-03-26 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_medicalreservation_status_tourismreservation_status'),
    ]

    operations = [
        migrations.RenameField(
            model_name='websiteusers',
            old_name='FirstName',
            new_name='FullName',
        ),
        migrations.RemoveField(
            model_name='websiteusers',
            name='LastName',
        ),
        migrations.RemoveField(
            model_name='websiteusers',
            name='ProfilePicture',
        ),
        migrations.AddField(
            model_name='websiteusers',
            name='age',
            field=models.IntegerField(default='22'),
        ),
    ]
# Generated by Django 4.1.7 on 2023-03-27 23:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_remove_websiteusers_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='websiteusers',
            name='picture',
            field=models.ImageField(default='none', upload_to='images/%y/%m/%d'),
        ),
    ]
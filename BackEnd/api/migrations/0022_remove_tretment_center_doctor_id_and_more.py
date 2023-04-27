# Generated by Django 4.1.7 on 2023-03-29 12:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_merge_20230329_1205'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tretment_center',
            name='doctor_id',
        ),
        migrations.AddField(
            model_name='doctor',
            name='treatment_center',
            field=models.ForeignKey(default='1', on_delete=django.db.models.deletion.CASCADE, to='api.tretment_center'),
        ),
    ]
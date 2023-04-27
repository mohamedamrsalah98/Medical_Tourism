# Generated by Django 4.1.7 on 2023-03-26 23:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_merge_20230326_2316'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='email',
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name='tretment_center',
            name='email',
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name='tretment_center',
            name='location',
            field=models.DecimalField(decimal_places=6, max_digits=9),
        ),
        migrations.AlterField(
            model_name='tretment_center',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
    ]
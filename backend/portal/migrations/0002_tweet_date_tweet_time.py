# Generated by Django 4.1 on 2022-08-09 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='date',
            field=models.DateField(auto_now=True),
        ),
        migrations.AddField(
            model_name='tweet',
            name='time',
            field=models.TimeField(auto_now=True),
        ),
    ]

# Generated by Django 4.1 on 2022-08-09 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0002_tweet_date_tweet_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='media_type',
            field=models.CharField(default='video', max_length=48),
            preserve_default=False,
        ),
    ]

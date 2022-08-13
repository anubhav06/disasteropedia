# Generated by Django 4.1 on 2022-08-08 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=280)),
                ('media', models.CharField(max_length=280)),
                ('link', models.CharField(max_length=120)),
                ('username', models.CharField(max_length=50)),
            ],
        ),
    ]
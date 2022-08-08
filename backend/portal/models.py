from django.db import models

# The tweet object
class Tweet(models.Model):

    text = models.CharField(max_length=280)
    media = models.CharField(max_length=280)
    link = models.CharField(max_length=120)
    username = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.username} says {self.text}"
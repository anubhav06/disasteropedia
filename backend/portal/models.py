from django.db import models

# The tweet object
class Tweet(models.Model):

    text = models.CharField(max_length=280)
    media = models.CharField(max_length=280)
    media_type = models.CharField(max_length=48)
    link = models.CharField(max_length=120)
    username = models.CharField(max_length=50)
    created_at = models.DateTimeField()

    def __str__(self):
        return f"Tweet by {self.username} on {self.created_at}"
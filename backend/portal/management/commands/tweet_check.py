from django.core.management.base import BaseCommand
from portal.models import Tweet

# A management command to delete old tweets from db
# Run command: "python manage.py tweet_check"
class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        # Max no of tweets we want to store in database
        max_tweets_count = 45

        all_tweets = Tweet.objects.all()        
        tweets_deleted = 0

        for index, tweet in enumerate(all_tweets):
            if index >= max_tweets_count: 
                try:
                    tweet.delete()
                except:
                    print('Error deleting tweet: ', tweet)
                tweets_deleted += 1
        
        total_tweets_count = Tweet.objects.all().count()
       
        print("Current tweet count:", total_tweets_count, "---- Deleted tweet count:", tweets_deleted)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

import re

from portal.models import Tweet
from portal.api.serializers import TweetSerializer

# For customizing the token claims: (whatever value we want)
# Refer here for more details: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        
        if user.groups.filter(name="Restaurant").exists():
            token['group'] = "Restaurant"
        else:
            token['group'] = "None"
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



# To add a tweet to DB
@api_view(['POST'])
def add_tweet(request):

    text = request.data['text']
    link = request.data['link']
    media = request.data['media']
    media_type = request.data['mediaType']
    username = request.data['username']
    created_at = request.data['created_at']
    
    # Remove the links from the text
    text = re.sub(r'http\S+', '', text)

    print('text: ', text)
    print('link: ', link)
    print('media: ', media)
    print('username: ', username)
    print('created_at: ', created_at)
    
    try:
        tweet = Tweet(text=text, link=link, media=media, media_type=media_type, username=username, created_at=created_at)
        tweet.save()
    except:
        return Response({'⚠️ ERROR: Unable to save tweet'})

    return Response({'Tweet added to database'})


# To view all the tweets
@api_view(['GET'])
def get_tweet(request):

    tweet = Tweet.objects.all()
    serializer = TweetSerializer(tweet, many=True)

    return Response(serializer.data)



# -------For DRF view --------------
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
    ]

    return Response(routes)
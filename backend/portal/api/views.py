from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

import json

from portal.models import Tweet

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


# To display temporary data
@api_view(['GET'])
def getData(request):

    data = {
        'name' : 'Anubhav',
        'profession' : 'Developer',
        'country' : 'India'
    }

    response = json.dumps(data)
    return Response(response)


# To add a tweet to DB
@api_view(['POST'])
def add_tweet(request):

    text = request.data['text']
    link = request.data['link']
    media = request.data['media']
    username = request.data['username']
 
    print('text: ', text)
    print('link: ', link)
    print('media: ', media)
    print('username: ', username)
    
    try:
        tweet = Tweet(text=text, link=link, media=media, username=username)
        tweet.save()
    except:
        return Response({'⚠️ ERROR: Unable to save tweet'})

    return Response({'Tweet added to database'})



# -------For DRF view --------------
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
    ]

    return Response(routes)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

import json

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


# -------For DRF view --------------
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
    ]

    return Response(routes)
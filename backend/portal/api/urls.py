from django.urls import path
from . import views
from .views import MyTokenObtainPairView

# Refer to: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#installation 
# for installation of JWT with DRF

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Refer to the corresponding view function for more detials of the url routes
urlpatterns = [ 
    # To display a list of available API routes through DRF
    path('', views.getRoutes, name="index"),
    path('data/', views.getData, name='data'),

    # For user authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]

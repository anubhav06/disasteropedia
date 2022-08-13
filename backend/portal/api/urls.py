from django.urls import path
from . import views

# Refer to the corresponding view function for more detials of the url routes
urlpatterns = [ 
    # To display a list of available API routes through DRF
    path('', views.getRoutes, name="index"),
    
    path('add-tweet/', views.add_tweet, name='addTweet'),
    path('get-tweet/', views.get_tweet, name='getTweet'),

]

from rest_framework.response import Response
from rest_framework.decorators import api_view

from portal.models import Tweet
from portal.api.serializers import TweetSerializer

import re
import requests

from backend.settings import nlp


# THE_ALGORITHM to validate the tweet
def validate_tweet(text):
    
    # Apply NLP on the text with Spacy
    # Refer here for docs: https://spacy.io/usage/spacy-101#annotations-ner
    doc = nlp(text)

    # List which stores places names (state/city etc.)
    place = []

    # ----------- Tweet filteration Level #2 (out of 3) -------------
    # Level-2: Checks if the tweet contains a place of disaster. ----
        
    for ent in doc.ents:
        print(ent.text, ent.start_char, ent.end_char, ent.label_)
        # If the entity is a place i.e is of type 'organization' or 'geo-polical-entity', then add that entity in the list
        if ent.label_ == 'ORG' or ent.label_ == 'GPE':
            place.append(ent)
    
    if len(doc.ents) == 0:
        for token in doc:
            # If the text contains a proper noun, then add it to the list
            print(token.text, token.lemma_, token.pos_, token.tag_, token.dep_,)
            if token.pos_ == 'PROPN':
                place.append(token.text)

    # Empty list means that no place was found in the tweet.
    if len(place) == 0:
        return False

    # ----------- Tweet filteration Level #3 (out of 3) ------------
    # Level-3: Confirms if the place of disaster is in India -------
    for place in place:
        params = {
            'action': 'query',
            'list': 'search',
            'utf8': '',
            'format': 'json',
            'srsearch': str(place)
        }
        # Make an API call to wikipedia to get information about the place
        try:
            api_call = requests.get(url='https://en.wikipedia.org/w/api.php', params=params)
        except:
            print('🔴 ERROR: Unable to make a GET request to Wikipedia API')

        # Check if the place is in India
        try:
            data = api_call.json()
            
            # Remove punctuations from the place
            place = re.sub("(:|-|,|'.')","", str(place))

            # Checks if the page's title consists of the place and if the place is an Indian state.
            # Refer to wikipedia's API to understand the API parameters in detail: https://www.mediawiki.org/wiki/API:Search
            for page in data['query']['search']:
                if (place.lower() in page['title'].lower() or page['title'].lower() in place.lower()) and ('Indian state' in page['snippet'] or 'India' in page['snippet']):
                    return True
        except:
            print('🔴 ERROR: In tweet filteration level #3')

    return False



# To add a tweet to database
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
    # Remove the hashtag from the text
    text = re.sub('#', '', text)


    # Validate if the tweet is relevant i.e. if it is related to a disaster, by passing it through the "algorithm"
    result = validate_tweet(text)
    if result is False:
        print('Discarded tweet-', text, 'by @', username)
        return Response({'ℹ️ Tweet irrelevant'})

    # Proceed to save the tweet if it's relevant i.e. related to a disaster
    try:
        tweet = Tweet(text=text, link=link, media=media, media_type=media_type, username=username, created_at=created_at)
        tweet.save()
    except:
        return Response({'⚠️ ERROR: Unable to save tweet'})

    return Response({'✅ Tweet added to database'})


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
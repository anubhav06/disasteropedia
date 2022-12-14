from rest_framework.response import Response
from rest_framework.decorators import api_view

from portal.models import Tweet
from portal.api.serializers import TweetSerializer

from django.core.paginator import Paginator, EmptyPage

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

    # Try-1
    for index, token in enumerate(doc):
        # Checks for India specific local places compound names
        if token.text.lower() in ["vihar", "nagar", "sarai", "enclave", "chowk", "bagh"]:
            place.append(doc[index-1].text + " " + token.text)
    
    # Try-2
    for ent in doc.ents:
        print(ent.text, ent.start_char, ent.end_char, ent.label_)
        # If the entity is a place i.e is of type 'organization' or 'geo-polical-entity' or 'national/religious/political group', then add that entity in the list
        if ent.label_ in ['ORG', 'GPE', 'NORP']:
            place.append(ent)
    
    # Try-3
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

        # Check if the place name is a state of India
        find_state = re.findall("assam|andhra pradesh|arunachal pradesh|bihar|chhattisgarh|delhi|goa|gujarat|haryana|himachal pradesh|jammu & kashmir|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|<span class=\"searchmatch\">odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|west bengal|uttarakhand", str(place).lower())
        if len(find_state) != 0:
            return find_state[0].title()

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
            print('???? ERROR: Unable to make a GET request to Wikipedia API')

        # Check if the place is in India
        try:
            data = api_call.json()
            
            # Remove punctuations from the place
            place = re.sub("(:|-|,|'.')","", str(place))

            # Checks if the page's title consists of the place and if the place is an Indian state.
            # Refer to wikipedia's API to understand the API parameters in detail: https://www.mediawiki.org/wiki/API:Search
            tweet_state = ''
            for page in data['query']['search']:
                if ('Indian state of' not in page['snippet'] and ', India' not in page['snippet']):
                    tweet_state = False
                else:
                    # Find the name of the state in India
                    state = re.findall("assam|andhra pradesh|arunachal pradesh|bihar|chhattisgarh|delhi|goa|gujarat|haryana|himachal pradesh|jammu & kashmir|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|<span class=\"searchmatch\">odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|west bengal|uttarakhand", page['snippet'].lower())
                    if len(state) != 0:
                        tweet_state = state[0].title()
                        return tweet_state
                    else:
                        # state = re.findall("assam|andhra pradesh|arunachal pradesh|bihar|chhattisgarh|delhi|goa|gujarat|haryana|himachal pradesh|jammu & kashmir|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|west bengal|uttarakhand, india", page['snippet'].lower())
                        # if len(state) != 0:
                        #     tweet_state = state[0].title()
                        #     return tweet_state
                        # else:
                        tweet_state = 'Unidentified'

        except:
            print('???? ERROR: In tweet filteration level #3')

    return tweet_state



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
    formatted_text = re.sub('#', '', text)

 
    # Validate if the tweet is relevant i.e. if it is related to a disaster, by passing it through the "algorithm"
    result = validate_tweet(formatted_text)
    if result is False:
        print('Discarded tweet-', text, 'by @', username)
        return Response({'?????? Tweet irrelevant'})

    # Find the disaster type from the tweet's text
    disaster_type = re.findall("flood|floods|flooded|flooding|wildfire|wildfires|eartquake|earthquakes|tornado|tornadoes|tornados|hurricane|hurricanes|drought|droughts|tsunami|tsunamis|landslide|landslides", text.lower())[0]
    
    # Trim the plural forms of the disaster type
    if disaster_type == 'tornadoes':
        disaster_type = 'tornado'
    elif disaster_type.endswith('s'):
        disaster_type = disaster_type[:-1]
    elif disaster_type.endswith('ed'):
        disaster_type = disaster_type[:-2]
    elif disaster_type.endswith('ing'):
        disaster_type = disaster_type[:-3]
        

    # Proceed to save the tweet if it's relevant i.e. related to a disaster
    try:
        tweet = Tweet(text=text, link=link, media=media, media_type=media_type, username=username, created_at=created_at, tweet_state=result, disaster_type=disaster_type)
        tweet.save()
    except:
        return Response({'?????? ERROR: Unable to save tweet'})

    return Response({'??? Tweet added to database'})


# To get the tweets by the state name
@api_view(['GET'])
def get_state_tweets(request, state):
    
    if state == 'All':
        tweet = Tweet.objects.all().order_by('-id')
        disaster_type = Tweet.objects.values("disaster_type").distinct()
    else:
        tweet = Tweet.objects.filter(tweet_state = state).order_by('-id')
        disaster_type = Tweet.objects.filter(tweet_state = state).values("disaster_type").distinct()
    
    # Pagination. Limit results to 4 per page
    p = Paginator(tweet, 4)
    try:
        page_num = request.query_params['page']
    except:
        page_num = 1
    try:
        page = p.page(page_num)
    except EmptyPage:
        page = p.page(1)
        
    serializer = TweetSerializer(page, many=True)
    tweet_state = Tweet.objects.values("tweet_state").distinct()

    return Response([serializer.data, p.num_pages, disaster_type, tweet_state])


# -------For DRF view --------------
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/',
        '/api/add-tweet/',
        '/api/get-tweet/<str:state>/'
    ]

    return Response(routes)
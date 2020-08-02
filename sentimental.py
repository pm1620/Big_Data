 
from textblob import TextBlob
from flask import request
import re
import random


from flask import Flask
app = Flask(__name__)


@app.route('/',methods = ['POST'])
def get_tweet_polarity():
    tweet = request.get_json()
    print(tweet)
    text=tweet["text"]
    cleanedTweet=' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)|(RT)", " ", text).split())
    analysis=TextBlob(cleanedTweet)
    tweet["polarity"] = analysis.polarity
    #tweet["polarity"] = random.uniform(-1, 1)
    return tweet

if __name__ == '__main__':
    app.run()

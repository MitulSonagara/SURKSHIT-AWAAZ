# sentiment_analysis.py
from textblob import TextBlob
import sys
import json

def perform_sentiment_analysis(text):
    blob = TextBlob(text)
    sentiment_polarity = blob.sentiment.polarity

    if sentiment_polarity > 0:
        sentiment_label = 'Positive Feedback'
    elif sentiment_polarity < 0:
        sentiment_label = 'Negative Feedback'
    else: 
        sentiment_label = 'Neutral Feedback'
 
    return sentiment_label

if __name__ == "__main__":
    input_text = sys.argv[1]
    sentiment_label = perform_sentiment_analysis(input_text)
    print(sentiment_label)

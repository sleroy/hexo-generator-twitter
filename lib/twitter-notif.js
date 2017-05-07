'use strict';
// See :
// https://apps.twitter.com/app/new
// https://www.yubigeek.com/api-streaming-twitter-bot-node-js/

const Twit = require('twit');
const logger = require('hexo-log')();

const TWEET_SIZE = 140;



module.exports = {
    new_client: twitter_new_client
};

/**
 * Twitter client
 * 
 * @class TwitterClient
 */
class TwitterClient {
    /**
     * Creates an instance of TwitterClient.
     * @param {any} config 
     * 
     * @memberOf TwitterClient
     */
    constructor(config) {
        this.config = config;
        this.twit = new Twit(config);
    }


    /**
     * Send a tweet
     * @param content a string to defined the content of the tweet
     * var PostData = {
                title_link: encodeURI(element.permalink),
                title: element.title,
                site_url: this.hexo.config.url,
                cover: "",
            };
     */
    send_tweet(content) {

        logger.info("[Hexo Twitter] Sending tweet ", content);

        // Disabled/Enabled feature control
        if (!this.config.enabled) {
            logger.warn("[Hexo Twitter] Sending tweet is disabled ");
            return new Promise(function(resolve, reject) {
                resolve("disabled");
            });
        }


        // Sending tweet

        return new Promise(function(resolve, reject) {
            this.twit.post('statuses/update', {
                status: content.tweet
            }, function(err, data, response) {
                if (err) {
                    logger.error("Could not update the status : " + err);
                    reject(err);
                } else {
                    logger.debug("Status updated : " + data);
                    resolve(data);
                }
            });
        });
    }



    /**
     * Builds the post data.
     * 
     * @returns a tweet data structure
     */
    new_tweet(tweetData) {

        // Decorating tweet
        const mytweet = {};

        // Build the media link
        if (tweetData.cover) {
            mytweet.media = tweetData.cover;
        } else if (tweetData.thumb) {
            mytweet.media = tweetData.thumb;
        } else {
            mytweet.media = null;
        }
        // Build the message
        let tweet = mytweet.tweet;
        if (!tweet) {
            // Build the text when the post does not define its text
            tweet = tweetData.title.substring(0, TWEET_SIZE);
        }
        // Append tags
        let tagString = "";
        if (tweetData.tags && tweetData.tags.data) {
            for (let tag of tweetData.tags.data) {
                logger.debug("tAG -> ", tag);
                tagString += " #" + tag.name;
            }
        }
        let tweet_tags = tweet + tagString;

        // Truncate and timestamp the message
        // Sets the message
        mytweet.tweet = timestamp_decorate(tweet_tags, this.config.add_timestamp);


        // Build the link
        mytweet.link = encodeURI(tweetData.title_link);

        mytweet.tweet = add_link(mytweet.tweet, mytweet.link);


        logger.debug("new tweet %j", mytweet);
        return mytweet;
    }

}


/**
 * Creates a new twitter component.
 * 
 */
function twitter_new_client(config) {
    return new TwitterClient(config);
}

/**
 * Adds a link to the tweet content
 */
function add_link(tweet, link) {

}


/**
 *  Decorates the tweet with a timestamp to avoid duplication.
 * 
 * @param {any} tweetContent 
 * @param {any} timestamp_flag 
 * @returns the tweet message with a timestamp if required
 */
function timestamp_decorate(tweetContent, timestamp_flag) {
    let tweet;
    if (timestamp_flag) {
        let timestamp = " " + Math.floor(new Date() / 1000);
        tweet = tweetContent.substring(0, TWEET_SIZE - timestamp.length());
    } else {
        tweet = tweetContent.substring(0, TWEET_SIZE);
    }
    return tweet;
}
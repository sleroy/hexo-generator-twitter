'use strict';
// See :
// https://apps.twitter.com/app/new
// https://www.yubigeek.com/api-streaming-twitter-bot-node-js/

const Twit = require('twit');
const logger = require('hexo-log')();

const TWEET_SIZE = 140;



module.exports = {
    send_tweet: twitter_send_tweet,
    new_tweet: twitter_new_tweet,
    new_client: twitter_new_client
};


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
function twitter_send_tweet(twitter, config, content) {

    logger.info("[Hexo Twitter] Sending tweet %j", content);

    // Disabled/Enabled feature control
    if (!config.enabled) {
        logger.warn("[Hexo Twitter] Sending tweet is disabled ");
        return new Promise(function(resolve, reject) {
            resolve("disabled");
        });
    }


    // Sending tweet

    return new Promise(function(resolve, reject) {
        twitter.post('statuses/update', {
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
 * @returns 
 */
function twitter_new_tweet(tweetData, config) {

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
    let tags = "";
    if (tweetData.tags) {
        console.log("tags ", tweetData.tags);
        tweetData.tags.forEach(tag => tags += " #" + tag);
    }
    let tweet_tags = tweet + tags;

    // Truncate and timestamp the message
    // Sets the message
    mytweet.tweet = timestamp_decorate(tweet_tags, config.add_timestamp);


    // Build the link
    mytweet.link = encodeURI(tweetData.title_link);

    logger.debug("new tweet %j", mytweet);
    return mytweet;
}

/**
 * Creates a new twitter component.
 * 
 */
function twitter_new_client(config) {
    return new Twit(config);
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
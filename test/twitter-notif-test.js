'use strict';

const should = require('chai').should(); // eslint-disable-line
const assert = require('chai').assert; // eslint-disable-line
const logger = require('hexo-log')();



describe('Twitter Notification', function() {
    const twitter = require('../lib/twitter-notif');

    describe('Send tweet', function() {

        it('sendTweet', function(done) {
            const config = require("./twitter.config.default");
            const T = twitter.new_client(config);

            const promise = twitter.send_tweet(T, config, "Discover my blog : https://sylvainleroy.com #Coding #Refactoring #Digital");
            promise
                .then((data) => {
                    logger.debug("Data -> " + data);
                    done();
                })
                .catch((err) => {
                    logger.debug("Error -> " + err);
                    done();
                });
        });

        it('sendTweet_disabled', function(done) {
            const config = require("./twitter.config.disabled");
            const T = twitter.new_client(config);

            const promise = twitter.send_tweet(T, config, "Discover my blog : https://sylvainleroy.com #Coding #Refactoring #Digital");
            promise
                .then((data) => {
                    logger.debug(data);
                    data.should.be.equals("disabled");
                    done();
                });


        });
    })

    describe('New tweet', function() {

        it('new_tweet', function() {

            const tweetData = require('./tweet.example');
            const config = require('./twitter.config.disabled');

            const new_tweet = twitter.new_tweet(tweetData, config);
            console.log(new_tweet);
            assert.isOk(new_tweet.tweet);
            assert.isOk(new_tweet.media);
            assert.isOk(new_tweet.link);
            assert.equal(new_tweet.tweet, "mytitle #C1 #C2 #C3");
            assert.equal(new_tweet.media, "coverPicture.jpg");
            assert.equal(new_tweet.link, "http://");
        });

    })

});
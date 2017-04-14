'use strict';

let should = require('chai').should(); // eslint-disable-line
let Hexo = require('hexo');
let cheerio = require('cheerio');

describe('Twitter Notification', function() {
    let hexo = new Hexo(__dirname, { silent: true });
    hexo.config.twitter = {
        consumer_key: 'GSh7JHZq2AHcfLmR7R7VQ842T',
        consumer_secret: 'eOzvHkM1SgE4d68RRv2bRRyq0QUaaAtPBjx7esdNFfLZ8wJmz',
        access_token: '3060152019-Nmt3Z9v9uR8QeI3rfdsK5Ko9WjkFJQ0g3UD4Gix',
        access_token_secret: ' p2H9MoCl5pf0UIdYLZd7hdQ5DYVAiKaLssME1vY6TzO5g',
    }
    let Post = hexo.model('Post');
    let notificator = require('../lib/twitter-notif');
    let posts;
    let locals;

    before(function() {
        return hexo.init().then(function() {
            return Post.insert([
                { source: 'foo', slug: 'foo', updated: 1e8 },
                { source: 'bar', slug: 'bar', updated: 1e8 + 1 },
                { source: 'baz', slug: 'baz', updated: 1e8 - 1 }
            ]).then(function(data) {
                posts = Post.sort('-updated');
                locals = hexo.locals.toObject();
            });
        });
    });

    it('initAndCloseNotification', function() {

        let twitterNotif = notificator(hexo);
        should.exist(twitterNotif);
        twitterNotif.close();
    });


    it('sendTweet', function(done) {

        let twitterNotif = notificator(hexo);
        let promise = twitterNotif.sendTweet("Discover my blog : https://sylvainleroy.com #Coding #Refactoring #Digital");
        promise
            .then()
            .catch();

        twitterNotif.close();
    });


});
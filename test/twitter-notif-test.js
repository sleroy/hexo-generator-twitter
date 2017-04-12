'use strict';

let should = require('chai').should(); // eslint-disable-line
let Hexo = require('hexo');
let cheerio = require('cheerio');

describe('Twitter Notification', function() {
    let hexo = new Hexo(__dirname, { silent: true });
    hexo.config.twitter = {
        consumerKey: 'your consumer Key',
        consumerSecret: 'your consumer secret',
        callback: 'http://yoururl.tld/something',
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


    it('sendTweet', function() {

        let twitterNotif = notificator(hexo);
        twitterNotif.sendTweet("Discover my blog : https://sylvainleroy.com #Coding #Refactoring #Digital")
        twitterNotif.close();
    });


});
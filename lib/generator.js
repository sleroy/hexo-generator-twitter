'use strict';
const low = require('lowdb');
const tunnel = require('global-tunnel');
const path = require('path');
const fs = require('fs');
const twitter = require('./twitter-notif');
const logger = require('hexo-log')();

/**
 * Method to control the configuration
 * 
 * @param {any} config the hexo config
 */
function checkConfig(config) {

    logger.debug('[Hexo Twitter] Checking configuration', config.twitter);
    if (!config.twitter) {
        logger.error('[Hexo Twitter] hexo.config.twitter invalid', config.twitter);
        return false;
    } else {
        if (!config.twitter.consumer_key) {
            logger.error('[Hexo Twitter] hexo.config.twitter.consumerKey is invalid : %j', config.twitter);
            return false;
        }
        if (!config.twitter.consumer_secret) {
            logger.error('[Hexo Twitter] hexo.config.twitter.consumerSecret is invalid : %j', config.twitter);
            return false;
        }
        if (!config.twitter.access_token) {
            logger.error('[Hexo Twitter] hexo.config.twitter.access_token is invalid : %j', config.twitter);
            return false;
        }
        if (!config.twitter.access_token_secret) {
            logger.error('[Hexo Twitter] hexo.config.twitter.access_token_secret is invalid : %j', config.twitter);
            return false;
        }
    }
    logger.debug('[Hexo Twitter] Configuration is OK.');
    return true;

}

/**
 * Method to initialize twitter notifications
 * @param hexo the hexo framework
 */
function init(hexo) {

    logger.debug('[Hexo Twitter] Initialization.');

    // Database initialization    
    let dbNotif = database_initialisation(hexo);

    // Database purge feature    
    if (hexo.config.twitter.database_renew) {
        logger.warn("[Hexo Twitter] Deleting previous posts");
        logger.warn("[Hexo Twitter] Actual posts " + dbNotif.get('social_notifs').size());
    }


    logger.debug("[Hexo Twitter] Configuration %j", hexo.config.twitter);
    // Component initialization
    let twit = twitter.new_client(hexo.config.twitter);

    hexo.locals.set('social', {
        config: hexo.config.twitter,
        siteURL: hexo.config.url,
        dbNotif: dbNotif,
        postsToNotify: [],
        allimagesUrls: [],
        twitter: twit,
        requestToken: null,
        requestTokenSecret: null,
    });

    // Build the twitter notification component    
    logger.debug('[Hexo Twitter] Registration.');

    // Register plugin
    hexo.extend.filter.register('after_post_render', function(data) {
        twitter_filter_after_post_render(hexo, data);
    });
    hexo.extend.generator.register('twitter', function(locals) {
        twitter_generate(locals, twit);
    });

}

function database_initialisation(hexo) {
    let dbNotif = low(path.join(hexo.base_dir, 'social-notif.json'));
    dbNotif.defaults({
        social_notifs: []
    }).value();
    return dbNotif;
}

/**
 * Describes the filter triggered for the event 'after_post_render'
 * 
 * @param {any} data 
 */
function twitter_filter_after_post_render(hexo, data) {


    const social = hexo.locals.get('social');
    const dbNotif = social.dbNotif;

    let tNotif = dbNotif.get('social_notifs').find({
        slug: data.slug
    }).value();
    logger.debug('[Hexo Twitter] Article in database(slug %s) : %d', data.slug, tNotif);

    if (!tNotif) {
        logger.debug('[Hexo Twitter] Register new post (%s) and marks it to be notified ', data._id);
        dbNotif.get('social_notifs').push({
            id: data._id,
            slug: data.slug,
            date: data.date,
            updated: data.updated,
            title: data.title
        }).value();
        data.notifyStatus = 'new';
        social.postsToNotify.push(data);
    } else {

        if (!tNotif.updated || new Date(tNotif.updated) < data.updated.toDate()) {
            //INFO : updated post.
            logger.debug('[Hexo Twitter] notify: updated post > data.updated.toDate', data.updated.toDate());
            logger.debug('[Hexo Twitter] notify: updated post > tNotif.updated', new Date(tNotif.updated));

            dbNotif.get('social_notifs').find({
                slug: data.slug
            }).assign({
                updated: data.updated
            }).value();

            data.notifyStatus = 'updated';
            social.postsToNotify.push(data);
        }
    }

}

/**
 * Describes the filter triggered for the event 'after_generate'
 * @param locals  hexo locals
 */
function twitter_generate(locals) {
    const social = locals.social;
    logger.debug("[Hexo Twitter] Notifying twitter for new or updated posts (%d)", social.postsToNotify.length);

    var configURL = social.siteURL;

    social.postsToNotify.forEach(

        element => {
            logger.debug('[Hexo Twitter] Notify for %j %j', element, element.permalink);

            let PostData = {
                title_link: element.permalink,
                title: element.title,
                site_url: configURL,
                cover: element.coverPicture,
                thumb: element.thumbPicture,
                categories: element.categories,
                tags: element.tags
            };


            let TweetData = social.twitter.new_tweet(
                PostData,
                social.config
            );

            logger.debug('[Hexo Twitter] Tweet %j', TweetData);

            // logger.debug('[Hexo Twitter] after_post_render TwitterData', TwitterData);

            social.twitter.send_tweet(TweetData, function(err, response) {
                if (response && response.statusCode != 200) { logger.error('[Hexo Twitter] Twitter.webhook err', response); }
                if (err) { logger.error('[Hexo Twitter] Twitter.webhook err', err); }
            });

        });


    social.allimagesUrls = [];
    social.postsToNotify = [];


}


module.exports = {
    checkConfig: checkConfig,
    init: init,
    twitter_generate: twitter_generate,
    twitter_filter_after_post_render: twitter_filter_after_post_render
};
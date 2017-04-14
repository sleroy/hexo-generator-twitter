'use strict';
const twitterNotif = require('./twitter-notif');

/**
 * Method to control the configuration
 * 
 * @param {any} config the hexo config
 */
function checkConfig(config) {

    if (!config.twitter) {
        console.error('[Hexo Twitter]: hexo.config.twitter invalid', config.twitter);
        return false;
    } else {
        if (!config.twitter.consumer_key) {
            console.error('[Hexo Twitter]: hexo.config.twitter.consumerKey invalid', config.twitter);
            return false;
        }
        if (!config.twitter.consumer_secret) {
            console.error('[Hexo Twitter]: hexo.config.twitter.consumerSecret invalid', config.twitter);
            return false;
        }
        if (!config.twitter.access_token) {
            console.error('[Hexo Twitter]: hexo.config.twitter.access_token invalid', config.twitter);
            return false;
        }
        if (!config.twitter.access_token_secret) {
            console.error('[Hexo Twitter]: hexo.config.twitter.access_token_secret invalid', config.twitter);
            return false;
        }
    }
    return true;

}

/**
 * Method to initialize twitter notifications
 * @param config the twitter plugin configuration
 */
function init(hexo) {
    return twitterNotif(hexo);
};



module.exports = {
    checkConfig: checkConfig,
    init: init
};
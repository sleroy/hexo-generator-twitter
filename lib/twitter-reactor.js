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
        if (!config.twitter.consumerKey) {
            console.error('[Hexo Twitter]: hexo.config.twitter.consumerKey invalid', config.twitter);
            return false;
        }
        if (!config.twitter.consumerSecret) {
            console.error('[Hexo Twitter]: hexo.config.twitter.consumerSecret invalid', config.twitter);
            return false;
        }
        if (!config.twitter.callback) {
            console.error('[Hexo Twitter]: hexo.config.twitter.callback invalid', config.twitter);
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
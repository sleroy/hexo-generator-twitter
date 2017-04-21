/* global hexo */
'use strict';

const assign = require('object-assign');
const logger = require('hexo-log')();
const path = require('path');
const fs = require('hexo-fs');
const generator = require('./lib/generator');


let config = hexo.config.twitter = assign({
        consumer_key: '...',
        consumer_secret: '...',
        access_token: '...',
        access_token_secret: '...',
        enabled: false,
        add_timestamp: true,
        database_renew: true
    },
    hexo.config.twitter);


logger.debug('[Hexo Twitter] register server_middleware');
logger.debug('[Hexo Twitter] process.env.http_proxy', process.env.http_proxy);

// Configuration control
if (generator.checkConfig(hexo.config)) {
    logger.debug('[Hexo Twitter] initialization server server_middleware');
    // Twitter notification component initialization
    generator.init(hexo);

} else {
    logger.error('[Hexo Twitter] cannot be executed, error in the Configuration');
}
/* global hexo */
'use strict';

const assign = require('object-assign');

const path = require('path');
const fs = require('hexo-fs');
const twitterReactor = require('./lib/twitter-reactor');


let config = hexo.config.twitter = assign({
        consumer_key: '...',
        consumer_secret: '...',
        access_token: '...',
        access_token_secret: '...',
        x_auth_access_type: "write",
        proxy: {
            enabled: false,
            host: '10.0.0.10',
            port: 8080,
            sockets: 50 // optional pool size for each http and https 
        }
    },
    hexo.config.twitter);


console.log('[Hexo Twitter]: register server_middleware');
console.log('[Hexo Twitter]: hexo', hexo.env.version);
console.log('[Hexo Twitter]: process.env.http_proxy', process.env.http_proxy);

// Configuration control
if (twitterReactor.checkConfig(config)) {
    console.log('[Hexo Twitter]: initialization server server_middleware');
    // Twitter notification component initialization
    const twitter = twitterReactor.init(config);

    twitter.registerPlugin(hexo);
} else {
    console.log('[Hexo Twitter]: cannot be executed, error in the Configuration');
}
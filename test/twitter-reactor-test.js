'use strict';

var should = require('chai').should(); // eslint-disable-line

describe('Twitter Reactor', function() {

    let generator = require('../lib/twitter-reactor');

    it('checkConfig_ok', function() {
        let config = {
            twitter: {
                consumer_key: '...',
                consumer_secret: '...',
                access_token: '...',
                access_token_secret: '...',
                callback: 'http://yoururl.tld/something',
            }
        };

        let result = generator.checkConfig(config);
        result.should.be.ok;
    });

    it('checkConfig_no_plugin_config', function() {
        let config = {

        };
        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });

    it('checkConfig_invalid_plugin_config_consumerkey', function() {
        let config = {
            twitter: {
                consumer_secret: '...',
                access_token: '...',
                access_token_secret: '...',
            }
        };
        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });

    it('checkConfig_invalid_plugin_config_consumerSECRET', function() {
        let config = {
            twitter: {
                consumer_key: '...',
                access_token: '...',
                access_token_secret: '...',
            }
        };

        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });

    it('checkConfig_invalid_plugin_config_access_token', function() {
        let config = {
            twitter: {
                consumer_key: '...',
                consumer_secret: '...',
                access_token: '...',
            }
        };

        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });


    it('checkConfig_invalid_plugin_config_access_token_secret', function() {
        let config = {
            twitter: {
                consumer_key: '...',
                consumer_secret: '...',
                access_token: '...',
            }
        };

        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });


    it('init', function() {});

});
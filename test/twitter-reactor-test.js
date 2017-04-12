'use strict';

var should = require('chai').should(); // eslint-disable-line

describe('Twitter Reactor', function() {

    let generator = require('../lib/twitter-reactor');

    it('checkConfig_ok', function() {
        let config = {
            twitter: {
                consumerKey: 'your consumer Key',
                consumerSecret: 'your consumer secret',
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
                consumerSecret: 'your consumer secret',
                callback: 'http://yoururl.tld/something',
            }
        };
        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });

    it('checkConfig_invalid_plugin_config_consumerSECRET', function() {
        let config = {
            twitter: {
                consumerKey: 'your consumer Key',
                callback: 'http://yoururl.tld/something',
            }
        };

        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });

    it('checkConfig_invalid_plugin_config_callback', function() {
        let config = {
            twitter: {
                consumerSecret: 'your consumer secret',
                consumerKey: 'your consumer Key',
            }
        };

        let result = generator.checkConfig(config);
        result.should.not.be.ok;
    });


    it('init', function() {});

});
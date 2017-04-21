'use strict';

const Hexo = require('hexo');
const should = require('chai').should(); // eslint-disable-line
const cheerio = require('cheerio');
const moment = require('moment');
const logger = require('hexo-log')();

describe('Social Generator', function() {
    let generator = require('../lib/generator');

    describe('Configuration checks', function() {

        it('checkConfig_ok', function() {
            let generator = require('../lib/generator');
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
            let generator = require('../lib/generator');
            let config = {

            };
            let result = generator.checkConfig(config);
            result.should.not.be.ok;
        });

        it('checkConfig_invalid_plugin_config_consumerkey', function() {
            let generator = require('../lib/generator');
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
            let generator = require('../lib/generator');
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
            let generator = require('../lib/generator');
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
            let generator = require('../lib/generator');
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
    });


    it('init', function() {
        let hexo = initHexo();

        generator.init(hexo);

    });

    it('twitter_filter_after_generate', function(done) {

        let hexo = initHexo();
        let postData = require("./postData.example1");

        let Post = hexo.model('Post');


        // Launch the generation
        Post.insert(postData).then(data => {

            data.forEach(element => injectTags(element));

            // treat posts
            data.forEach(element => hexo.execFilterSync("after_post_render", element));

            //logger.info("Data ", data);

            logger.debug("Sorting posts");
            let posts = Post.sort('-date');
            let locals = hexo.locals.toObject();

            logger.debug("Triggering Twitter notification");
            // Configuration control
            if (generator.checkConfig(hexo.config)) {

                logger.debug('[Hexo Twitter]: initialization server server_middleware');
                // Twitter notification component initialization
                should.exist(hexo.locals.get('twitter'));
                generator.twitter_generate(hexo.locals.toObject());

                done();
            } else {
                console.error('[Hexo Twitter]: cannot be executed, error in the configuration');
                throw new Error("Configuration should be ok");
            }


        }).catch(function(e) {
            console.error("Post insertion has failed.", e);
            throw new Error("Post insertion has failed." + e);
        });
    });


    it('twitter_filter_after_post_render_new', function() {
        let hexo = initHexo();

        let postData = {
            slug: "48Z098498Z09849088098",
            _id: 12,
            date: moment(),
            updated: moment()
        };

        generator.twitter_filter_after_post_render(hexo, postData);
        postData.notifyStatus.should.be.equals("new");

    });

    it('twitter_filter_after_post_render_new_and_update', function() {
        let hexo = initHexo();

        let postData = {
            slug: "04909090909",
            _id: 13,
            date: moment(),
            updated: moment()
        };

        generator.twitter_filter_after_post_render(hexo, postData);
        postData.notifyStatus.should.be.equals("new");
        // Updates it
        let postData2 = {
            slug: "04909090909",
            _id: 13,
            date: moment(),
            updated: moment().add(1, 'days')
        };


        generator.twitter_filter_after_post_render(hexo, postData2);
        postData2.notifyStatus.should.be.equals("updated");




    });


    it('twitter_filter_after_post_render_new_and_update', function() {
        let hexo = initHexo();

        let postData = {
            slug: "04909090909",
            _id: 13,
            date: moment(),
            updated: moment()
        };

        generator.twitter_filter_after_post_render(hexo, postData);
        postData.notifyStatus.should.be.equals("new");
        // Updates it
        let postData2 = {
            slug: "04909090909",
            _id: 13,
            date: moment(),
            updated: moment().add(1, 'days')
        };


        generator.twitter_filter_after_post_render(hexo, postData2);
        postData2.notifyStatus.should.be.equals("updated");


    });


    function injectTags(element) {

        element.setTags(['tag1', 'tag2']);

        //hexo.execFilterSync("after_post_render", element)
    }

    function initHexo() {
        let hexo = new Hexo(__dirname, { silent: true });
        (require('../node_modules/hexo/lib/plugins/helper'))(hexo);

        hexo.config.twitter = require("./twitter.config.default");
        generator.init(hexo);
        return hexo;
    }

});
'use strict';

var should = require('chai').should(); // eslint-disable-line
var Hexo = require('hexo');

describe('Twitter Plugin Index', function() {
    var hexo = new Hexo(__dirname, { silent: true });
    var generator = require('../lib/twitter-reactor').bind(hexo);

});
'use strict';

let should = require('chai').should(); // eslint-disable-line
let Hexo = require('hexo');

describe('Twitter Plugin Index', function() {
    let hexo = new Hexo(__dirname, { silent: true });
    let generator = require('../lib/twitter-reactor');

});
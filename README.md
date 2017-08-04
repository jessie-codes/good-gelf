# good-gelf

[![Build Status](https://travis-ci.org/jessie-codes/good-gelf.svg?branch=master)](https://travis-ci.org/jessie-codes/good-gelf)
[![npm version](https://badge.fury.io/js/good-gelf.svg)](https://badge.fury.io/js/good-gelf)


Good Reporter for Graylog.

This module is for transforming good logs into `gelf` format for Graylog. This module is intended to be used with other good modules, such as `good-file` for saving the output for scenarios in which UDP will not work.

If you're looking for a UDP version, try [good-graylog2](https://www.npmjs.com/package/good-graylog2).

## Options

+ **format** `String` : The format the timestamp should be saved with. If not passed, it will default to POSIX time.
+ **info** `Object` : An object containing parameters that should be added to each log entry.

## Usage

```javascript

'use strict';

const Hapi = require('hapi');
const good = require('good');

const server = new Hapi.Server();
server.connection();

const options = {
    reporters: {
        gelf: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-gelf',
						args: ['YYYY-MM-DD', {app: 'Dashboard'}]
        }, {
            module: 'good-file',
            args: ['./server.log']
        }]
    }
};

server.register({
    register: good,
    options
}, err => {
    if (err) return console.error(err);

    server.start(() => {
        console.info(`Server started at ${ server.info.uri }`);
    });
});

```

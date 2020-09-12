# good-gelf

[![NPM](https://nodei.co/npm/good-gelf.png?compact=true)](https://nodei.co/npm/good-gelf/)

[![Known Vulnerabilities](https://snyk.io/test/github/jessie-codes}/good-gelf/badge.svg)](https://snyk.io/test/github/jessie-codes}/good-gelf)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/jessie-codes/good-gelf.svg?branch=master)](https://travis-ci.org/jessie-codes/good-gelf)
[![Coverage Status](https://coveralls.io/repos/github/jessie-codes/good-gelf/badge.svg?branch=master)](https://coveralls.io/github/jessie-codes/good-gelf?branch=master)

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

## Output

```json

{"_event":"request","timestamp":"2017-08-10 16:42:24.957","_tags_0":"user","_tags_1":"info","_data":"you made a default log","_pid":64291,"version":"1.1","host":"hostname","message":"Log event for tags: [\"user\",\"info\"]","short_message":"Log event for tags: [\"user\",\"info\"]"}

```

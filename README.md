# good-gelf

Good Reporter for Graylog.

This module is for transforming good logs into `gelf` format for Graylog. This module is intended to be used with other good modules, such as `good-file` for saving the output for scenarios in which UDP will not work.

If you're looking for a UDP version, try [good-graylog2](https://www.npmjs.com/package/good-graylog2).

## Usage

```javascript

'use strict';

const Hapi = require('hapi');
const good = require('good');

const server = new Hapi.Server();
server.connection();

const options = {
    reporters: [{
        gelf: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-gelf'
        }, {
            module: 'good-file',
            args: ['./server.log']
        }]
    }]
};

server.register({
    register: good,
    options
} err => {
    if (err) return console.error(err);

    server.start(() => {
        console.info(`Server started at ${ server.info.uri }`);
    });
});

```

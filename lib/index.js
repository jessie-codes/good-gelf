'use strict';

const hostname = require('os').hostname();
const Stream = require('stream');
const stringify = require('fast-safe-stringify');
const timestamp = require('time-stamp');
const forOwn = require('lodash.forown');

const flatten = function flatten (original, attr) {
	let flat = {};

	forOwn(original, (value, key) => {
		const newKey = attr ? `${attr}_${key}` : `_${key}`;

		if (typeof value === 'object') {
			Object.assign(flat, flatten(value, newKey));
		} else {
			flat[newKey] = value;
		}
	});

	return flat;
};

const internals = {
	formatObject (data, message) {
		let gelf = flatten(Object.assign({}, data, internals.info));

		gelf.version = '1.1';
		gelf.host = hostname;
		if (internals.format) {
			gelf.timestamp = timestamp(internals.format);
		}
		gelf.short_message = gelf.message = message;

		return `${stringify(gelf)}\r\n`;
	}
};

class Gelf extends Stream.Transform {
	constructor (format, info) {
		super({ objectMode: true });
		internals.format = format;
		internals.info = info;
	}

	_transform (data, enc, next) {
		switch (data.event) {
			case 'error':
				return next(null, internals.formatObject(data, data.error.name));
			case 'ops':
				return next(null, internals.formatObject(data, `Stats for ${data.timestamp}`));
			case 'response':
				return next(null, internals.formatObject(data, `Response for ${data.path}`));
			case 'wreck':
				return next(null, internals.formatObject(data, `Wreck response for ${data.request.path}`));
			default:
				return next(null, internals.formatObject(data, `Log event for tags: ${stringify(data.tags)}`));
		}
	}
}

module.exports = Gelf;

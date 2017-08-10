'use strict';

const hostname = require('os').hostname();
const Stream = require('stream');
const stringify = require('fast-safe-stringify');
const timestamp = require('time-stamp');

const internals = {
	formatObject (data, message) {
		let gelf = {};

		const flatten = (pointer, attr) => {
			if (Object(pointer) !== pointer) {
				if (attr === 'timestamp') {
					gelf.timestamp = pointer;
				} else {
					gelf[`_${attr}`] = pointer;
				}
			} else if (Array.isArray(pointer)) {
				for (let i = 0, len = pointer.length; i < len; i++) {
					flatten(pointer[i], `${attr}_${i}`);
				}
			} else {
				for (const n in pointer) {
					flatten(pointer[n], attr ? `${attr}_${n}` : n);
				}
			}
		};

		flatten(Object.assign({}, data, internals.info));

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

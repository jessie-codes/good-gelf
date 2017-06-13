'use strict';

const hostname = require('os').hostname();
const Stream = require('stream');
const stringify = require('fast-safe-stringify');

const internals = {
	formatObject(data, message){
		let gelf = {};

		const flatten = (pointer, attr) => {
			if (Object(pointer) !== pointer){

				gelf[`_${attr}`] = pointer;
			} else if (Array.isArray(pointer)){
				for (let i = 0, len = pointer.length; i < len; i++){
					flatten(pointer[i], `attr[${i}]`)
				}
			} else {
				for (const n in pointer){
					flatten(pointer[n], attr ? `${attr}.${n}` : n)
				}
			}
		}

		flatten(data);

		gelf.version = '1.1';
		gelf.host = hostname;
		gelf.timestamp = data.timestamp;
		gelf.short_message = message;

		return `${stringify(gelf)}\r\n`;
	}
};

class Gelf extends Stream.Transform {
	constructor(){
		super({ objectMode: true });
	}

	_transform(data, enc, next) {
		switch (data.event){
			case 'error':
				return next(null, internals.formatObject(data, data.error.name))
			case 'ops':
				return next(null, internals.formatObject(data, `Stats for ${data.timestamp}`))
			case 'response':
				return next(null, internals.formatObject(data, `Response for ${data.path}`))
			case 'wreck':
				return next(null, internals.formatObject(data, `Wreck response for ${data.request.path}`))
			default:
				return next(null, internals.formatObject(data, data.data))
		}
	}
}

module.exports = Gelf;
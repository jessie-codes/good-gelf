'use strict'

const Stream = require('stream')
const stringify = require('fast-safe-stringify')
const transforms = require('./transforms.js')

const internals = {
  formatObject: transforms.formatObject
}

class Gelf extends Stream.Transform {
  constructor (format, info) {
    super({ objectMode: true })
    internals.format = format
    internals.info = info
  }

  _transform (data, enc, next) {
    switch (data.event) {
      case 'error':
        return next(null, internals.formatObject(data, data.error.name, internals))
      case 'ops':
        return next(null, internals.formatObject(data, `Stats for ${data.timestamp}`, internals))
      case 'response':
        return next(null, internals.formatObject(data, `Response for ${data.path}`, internals))
      case 'wreck':
        return next(null, internals.formatObject(data, `Wreck response for ${data.request.path}`, internals))
      default:
        return next(null, internals.formatObject(data, `Log event for tags: ${stringify(data.tags)}`, internals))
    }
  }
}

module.exports = Gelf

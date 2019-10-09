
const flat = require('safe-flat')
const hostname = require('os').hostname()
const stringify = require('fast-safe-stringify')
const timestamp = require('time-stamp')
const { mapKeys } = require('lodash')

const flatten = (original) => {
  let result = flat(original, '_')

  result = mapKeys(result, (value, key) => `_${key}`)

  /* eslint-disable */
      delete result._timestamp;
    /* eslint-enable */

  return result
}

const formatObject = (data, message, internals) => {
  const gelf = flatten(Object.assign({}, data, internals.info))

  gelf.version = '1.1'
  gelf.host = hostname
  if (internals.format) {
    gelf.timestamp = timestamp(internals.format)
  }
  gelf.short_message = gelf.message = message

  return `${stringify(gelf)}\r\n`
}

module.exports = {
  flatten,
  formatObject
}

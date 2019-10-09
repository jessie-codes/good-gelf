'use strict'

const test = require('tape')
const Streams = require('./fixture/streams')
const GoodGelf = require('../lib')

const internals = {}

internals.ops = {
  event: 'ops',
  timestamp: 1458264810957,
  host: 'localhost',
  pid: 64291,
  os: {
    load: [1.650390625, 1.6162109375, 1.65234375],
    mem: {
      total: 17179869184,
      free: 8190681088
    },
    uptime: 704891
  },
  proc: {
    uptime: 6,
    mem: {
      rss: 30019584,
      heapTotal: 18635008,
      heapUsed: 9989304
    },
    delay: 0.03084501624107361
  },
  load: {
    requests: {},
    concurrents: {},
    responseTimes: {},
    listener: {},
    sockets: {
      http: {},
      https: {}
    }
  }
}

internals.response = {
  event: 'response',
  timestamp: 1458264810957,
  id: '1458264811279:localhost:16014:ilx17kv4:10001',
  instance: 'http://localhost:61253',
  labels: [],
  method: 'post',
  path: '/data',
  query: {
    name: 'adam'
  },
  responseTime: 150,
  statusCode: 200,
  pid: 16014,
  httpVersion: '1.1',
  source: {
    remoteAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Macintosh)',
    referer: 'http://localhost:61253/'
  }
}

internals.request = {
  event: 'request',
  timestamp: 1458264810957,
  tags: ['user', 'info'],
  data: 'you made a request',
  pid: 64291,
  id: '1419005623332:new-host.local:48767:i3vrb3z7:10000',
  method: 'get',
  path: '/'
}

internals.error = {
  event: 'error',
  timestamp: 1458264810957,
  id: '1419005623332:new-host.local:48767:i3vrb3z7:10000',
  tags: ['user', 'info'],
  url: 'http://localhost/test',
  method: 'get',
  pid: 64291,
  error: new Error('Just a simple error')
}

internals.default = {
  event: 'request',
  timestamp: 1458264810957,
  tags: ['user', 'info'],
  data: 'you made a default log',
  pid: 64291
}

test('returns a formatted string for "ops" events', (t) => {
  const reporter = new GoodGelf()
  const out = new Streams.Writer()
  const reader = new Streams.Reader()

  reader.pipe(reporter).pipe(out)
  reader.push(internals.ops)
  reader.push(null)

  reader.once('end', () => {
    t.equal(out.data.length, 1)

    const index = out.data[0].indexOf(`short_message:"Stats for ${internals.ops.timestamp}"`)

    t.ok(index)
    t.end()
  })
})

test('returns a formatted string for "response" events', (t) => {
  const reporter = new GoodGelf()
  const out = new Streams.Writer()
  const reader = new Streams.Reader()

  reader.pipe(reporter).pipe(out)
  reader.push(internals.response)
  reader.push(null)

  reader.once('end', () => {
    t.equal(out.data.length, 1)

    const index = out.data[0].indexOf(`short_message:"Response for ${internals.response.path}"`)

    t.ok(index)
    t.end()
  })
})

test('returns a formatted string for "error" events', (t) => {
  const reporter = new GoodGelf()
  const out = new Streams.Writer()
  const reader = new Streams.Reader()

  reader.pipe(reporter).pipe(out)
  reader.push(internals.error)
  reader.push(null)

  reader.once('end', () => {
    t.equal(out.data.length, 1)

    const index = out.data[0].indexOf(`short_message:"${internals.error.error.name}"`)

    t.ok(index)
    t.end()
  })
})

test('returns a formatted string for other events', (t) => {
  const reporter = new GoodGelf()
  const out = new Streams.Writer()
  const reader = new Streams.Reader()

  reader.pipe(reporter).pipe(out)
  reader.push(internals.default)
  reader.push(null)

  reader.once('end', () => {
    t.equal(out.data.length, 1)
    t.end()
  })
})

test('should format the timestamp', (t) => {
  const reporter = new GoodGelf('YYYY-MM-DD HH:mm:ss.ms')
  const out = new Streams.Writer()
  const reader = new Streams.Reader()

  reader.pipe(reporter).pipe(out)
  reader.push(internals.default)
  reader.push(null)

  reader.once('end', () => {
    t.equal(out.data.length, 1)

    const index = out.data[0].indexOf(/timestamp:"[0-9]{4}-[0-9]{2}-[0-9]{2}"/)

    t.ok(index)
    t.end()
  })
})

test('should add the info passed in', (t) => {
  const reporter = new GoodGelf(null, { app: 'Dashboard' })
  const out = new Streams.Writer()
  const reader = new Streams.Reader()

  reader.pipe(reporter).pipe(out)
  reader.push(internals.default)
  reader.push(null)

  reader.once('end', () => {
    t.equal(out.data.length, 1)

    const index = out.data[0].indexOf('_app:Dashboard')

    t.ok(index)
    t.end()
  })
})

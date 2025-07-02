import { describe, it, beforeEach, before } from 'node:test'
import { strict as assert } from 'node:assert'
import logfmtTransport from '../src/transport.js'
import { mkdir, readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import pino from 'pino'

/**
 * @type {string}
 */
let testLogDirectory
/**
 * @type {string}
 */
let logFile

beforeEach(async () => {
  testLogDirectory = `var/${randomUUID()}`

  await mkdir(testLogDirectory, {
    recursive: true
  })

  logFile = `${testLogDirectory}/log`
})

before(() => {
  console.log(`Current Node.js version is ${process.version}`)
})

it('should be able to output logfmt formatted logs', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile
  })

  const logger = pino({
    timestamp: false,
    base: {}
  }, transport)

  // When
  logger.info('foo')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 msg=foo',
    ''
  ])
})

it('doesn\'t automatically escape multi-line strings', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile
  })

  const logger = pino({
    timestamp: false,
    base: {}
  }, transport)

  // When
  logger.info('foo\nbar')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 msg=foo',
    'bar',
    ''
  ])
})

it('escapes multi-line strings when escapeMultilineStrings is Enabled', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
    escapeMultilineStrings: true
  })

  const logger = pino({
    timestamp: false,
    base: {}
  }, transport)

  // When
  logger.info('foo\nbar')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 msg="foo\\\\nbar"',
    ''
  ])
})

it('should be able to include the level label', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
    includeLevelLabel: true
  })

  const logger = pino({
    timestamp: false,
    base: {}
  }, transport)

  // When
  logger.info('foo')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 msg=foo level_label=info',
    ''
  ])
})

it('should be able to include the timestamp', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile
  })

  const logger = pino({
    timestamp: () => ',"timestamp": 1709818522782',
    base: {}
  }, transport)

  // When
  logger.info('foo')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 timestamp=1709818522782 msg=foo',
    ''
  ])
})

it('should be able to include metadata in the log line', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile
  })

  const logger = pino({
    timestamp: false,
    base: {}
  }, transport)

  // When
  logger.info({ metadata: 'bar' }, 'foo')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 metadata=bar msg=foo',
    ''
  ])
})

it('should be able to convert names from camel case to snake case', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
    convertToSnakeCase: true
  })

  const logger = pino({
    timestamp: false,
    base: {}
  }, transport)

  // When
  logger.info({ myMetadata: 'bar' }, 'foo')

  // Then
  assert.deepEqual(await loadLog(logFile), [
    'level=30 msg=foo my_metadata=bar',
    ''
  ])
})

describe('time format', function () {
  it('should be able to format the timestamp to a ISO string', async function () {
    // Given
    const transport = await logfmtTransport({
      sync: true,
      destination: logFile,
      formatTime: true
    })

    const logger = pino({
      timestamp: () => ',"time": 1709818522782',
      base: {}
    }, transport)

    // When
    logger.info('foo')

    // Then
    assert.deepEqual(await loadLog(logFile), [
      'level=30 time=2024-03-07T14:35:22+0100 msg=foo',
      ''
    ])
  })

  it('should be able to use a custom key when formatting the timestamp', async function () {
    // Given
    const transport = await logfmtTransport({
      sync: true,
      destination: logFile,
      formatTime: true,
      timeKey: 'timestamp'
    })

    const logger = pino({
      timestamp: () => ',"timestamp": 1709818522782',
      base: {}
    }, transport)

    // When
    logger.info('foo')

    // Then
    assert.deepEqual(await loadLog(logFile), [
      'level=30 timestamp=2024-03-07T14:35:22+0100 msg=foo',
      ''
    ])
  })

  it('should be able to format time using a custom format', async function () {
    // Given
    const transport = await logfmtTransport({
      sync: true,
      destination: logFile,
      formatTime: true,
      timeKey: 'timestamp',
      timeFormat: 'dddd, mmmm dS, yyyy, h:MM:ss TT'
    })

    const logger = pino({
      timestamp: () => ',"timestamp": 1709818522782',
      base: {}
    }, transport)

    // When
    logger.info('foo')

    // Then
    assert.deepEqual(await loadLog(logFile), [
      'level=30 timestamp="Thursday, March 7th, 2024, 2:35:22 PM" msg=foo',
      ''
    ])
  })
})

describe('level labels', function () {
  it('should be able to include the level label under a custom key', async function () {
    // Given
    const transport = await logfmtTransport({
      sync: true,
      destination: logFile,
      includeLevelLabel: true,
      levelLabelKey: 'my_level_label'
    })

    const logger = pino({
      timestamp: false,
      base: {}
    }, transport)

    // When
    logger.info('foo')

    // Then
    assert.deepEqual(await loadLog(logFile), [
      'level=30 msg=foo my_level_label=info',
      ''
    ])
  })

  it('should be able to use custom level labels', async function () {
    // Given
    const transport = await logfmtTransport({
      sync: true,
      destination: logFile,
      includeLevelLabel: true,
      customLevels: {
        55: 'critic'
      }
    })

    const logger = pino({
      timestamp: false,
      base: {},
      customLevels: {
        critic: 55
      }
    }, transport)

    // When
    logger.critic('foo')

    // Then
    assert.deepEqual(await loadLog(logFile), [
      'level=55 msg=foo level_label=critic',
      ''
    ])
  })

  it('should be able to display a default label given the level is not configured', async function () {
    // Given
    const transport = await logfmtTransport({
      sync: true,
      destination: logFile,
      includeLevelLabel: true
    })

    const logger = pino({
      timestamp: false,
      base: {},
      customLevels: {
        critic: 55
      }
    }, transport)

    // When
    logger.critic('foo')

    // Then
    assert.deepEqual(await loadLog(logFile), [
      'level=55 msg=foo level_label=unknown',
      ''
    ])
  })
})

/**
 * Read and parse the given log file.
 *
 * @param {string} file
 * @returns {Promise<string[]>}
 */
async function loadLog (file) {
  const content = await readFile(file, 'utf-8')
  return content.split('\n')
}

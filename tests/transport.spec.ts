import logfmtTransport from "../src/transport"
import {mkdir, readFile} from "node:fs/promises"
import {randomUUID} from "node:crypto"
import pino from "pino";
import {expect} from "chai";

let testLogDirectory!: string
let logFile!: string

beforeEach(async () => {
  testLogDirectory = `var/${randomUUID()}`

  await mkdir(testLogDirectory, {
    recursive: true
  })

  logFile = `${testLogDirectory}/log`
})

it('should be able to output logfmt formatted logs', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile
  })

  const logger = pino({
    timestamp: false,
    base: {},
  }, transport)

  // When
  logger.info("foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 msg=foo",
    ""
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
    base: {},
  }, transport)

  // When
  logger.info("foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 msg=foo level_label=info",
    ""
  ])
})

it('should be able to include the level label under a custom key', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
    includeLevelLabel: true,
    levelLabelKey: "my_level_label"
  })

  const logger = pino({
    timestamp: false,
    base: {},
  }, transport)

  // When
  logger.info("foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 msg=foo my_level_label=info",
    ""
  ])
})

it('should be able to include the timestamp', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
  })

  const logger = pino({
    timestamp: () => ',"timestamp": 1709818522782',
    base: {},
  }, transport)

  // When
  logger.info("foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 timestamp=1709818522782 msg=foo",
    ""
  ])
})

it('should be able to format the timestamp using .toISOString()', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
    formatTime: true
  })

  const logger = pino({
    timestamp: () => ',"time": 1709818522782',
    base: {},
  }, transport)

  // When
  logger.info("foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 time=2024-03-07T13:35:22.782Z msg=foo",
    ""
  ])
})

it('should be able to use a custom key when formatting the timestamp', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
    formatTime: true,
    timeKey: "timestamp"
  })

  const logger = pino({
    timestamp: () => ',"timestamp": 1709818522782',
    base: {},
  }, transport)

  // When
  logger.info("foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 timestamp=2024-03-07T13:35:22.782Z msg=foo",
    ""
  ])
})

it('should be able to include metadata in the log line', async function () {
  // Given
  const transport = await logfmtTransport({
    sync: true,
    destination: logFile,
  })

  const logger = pino({
    timestamp: false,
    base: {},
  }, transport)

  // When
  logger.info({ metadata: "bar" }, "foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 metadata=bar msg=foo",
    ""
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
    base: {},
  }, transport)

  // When
  logger.info({ myMetadata: "bar" }, "foo")

  // Then
  expect(await loadLog(logFile)).to.deep.equal([
    "level=30 msg=foo my_metadata=bar",
    ""
  ])
})

async function loadLog (file: string): Promise<string[]> {
  const content = await readFile(file, "utf-8")
  return content.split("\n")
}

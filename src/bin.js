#!/usr/bin/env node
import { parseArgs } from 'node:util'
import createTransport, { baseLevelToLabel } from './transport.js'
import pump from 'pump'
import { serialize, parse } from './levels.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as url from 'url'

cli()

function cli () {
  const { version, description } = JSON.parse(readFileSync(join(url.fileURLToPath(new URL('.', import.meta.url)), '..', 'package.json'), 'utf8'))

  try {
    const { values } = parseArgs({
      options: {
        help: {
          type: 'boolean',
          short: 'h'
        },
        version: {
          type: 'boolean',
          short: 'v'
        },
        'include-level-label': {
          type: 'boolean',
          default: false
        },
        'level-label-key': {
          type: 'string',
          default: 'level_label'
        },
        'format-time': {
          type: 'boolean',
          default: false
        },
        'time-key': {
          type: 'string',
          default: 'time'
        },
        'snake-case': {
          type: 'boolean',
          default: false
        },
        'flatten-nested': {
          type: 'boolean',
          default: false
        },
        'flatten-separator': {
          type: 'string',
          default: '.'
        },
        'custom-levels': {
          type: 'string',
          short: 'x',
          default: serialize(baseLevelToLabel)
        },
        'time-format': {
          type: 'string',
          default: 'isoDateTime'
        },
        'escape-multiline-strings': {
          type: 'boolean',
          default: false
        }
      },
      allowPositionals: false
    })

    if (values.help) {
      showHelp(description)
      process.exit(0)
    }

    if (values.version) {
      console.log(version)
      process.exit(0)
    }

    // Convert kebab-case to camelCase for compatibility
    const opts = {
      includeLevelLabel: values['include-level-label'],
      levelLabelKey: values['level-label-key'],
      formatTime: values['format-time'],
      timeKey: values['time-key'],
      snakeCase: values['snake-case'],
      flattenNested: values['flatten-nested'],
      flattenSeparator: values['flatten-separator'],
      customLevels: values['custom-levels'],
      timeFormat: values['time-format'],
      escapeMultilineStrings: values['escape-multiline-strings']
    }

    action(opts).catch(console.error)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

function showHelp (description) {
  console.log(`${description}

Usage: pino-logfmt [options]

Options:
  -h, --help                        Show help
  -v, --version                     Show version
  --include-level-label             Add the level as a label
  --level-label-key <string>        The key of the level label (default: "level_label")
  --format-time                     Format the timestamp into an ISO date
  --time-key <string>               The key that holds the timestamp (default: "time")
  --snake-case                      Convert the keys to snake case
  --flatten-nested                  Flatten nested metadata
  --flatten-separator <string>      The separator used when flattening nested metadata (default: ".")
  -x, --custom-levels <string>      The levels associated to their labels in the format "10:trace,20:debug"
  --time-format <string>            The time format to use if time formatting is enabled (default: "isoDateTime")
  --escape-multiline-strings        Escape multi-line strings in the log output, including deeply nested values
`)
}

/**
 * @param {ProgramOptions} opts
 * @returns {Promise<void>}
 */
async function action (opts) {
  const {
    includeLevelLabel,
    levelLabelKey,
    timeKey,
    formatTime,
    snakeCase: convertToSnakeCase,
    flattenNested: flattenNestedObjects,
    customLevels: serializedCustomLevels,
    timeFormat,
    escapeMultilineStrings
  } = opts

  const customLevels = serializedCustomLevels !== undefined
    ? parse(serializedCustomLevels)
    : undefined

  const transport = await createTransport({
    includeLevelLabel,
    levelLabelKey,
    timeKey,
    formatTime,
    convertToSnakeCase,
    flattenNestedObjects,
    customLevels,
    timeFormat,
    escapeMultilineStrings
  })

  pump(process.stdin, transport)
}

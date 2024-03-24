#!/usr/bin/env node
import { program } from 'commander'
import createTransport, { baseLevelToLabel } from './transport.js'
import pump from 'pump'
import { serialize, parse } from './levels.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as url from 'url'

cli()

function cli () {
  const { version, description } = JSON.parse(readFileSync(join(url.fileURLToPath(new URL('.', import.meta.url)), '..', 'package.json'), 'utf8'))

  program
    .version(version)
    .description(description)
    .option('--include-level-label', 'add the level as a label', false)
    .option('--level-label-key <string>', 'the key of the level label', 'level_label')
    .option('--format-time', 'format the timestamp into an ISO date', false)
    .option('--time-key <string>', 'the key that holds the timestamp', 'time')
    .option('--snake-case', 'convert the keys to snake case', false)
    .option('--flatten-nested', 'flatten nested metadata', false)
    .option('--flatten-separator <string>', 'the separator used when flattening nested metadata', '.')
    .option('--custom-levels, -x <string>', 'the levels associated to their labels in the format "10:trace,20:debug"', serialize(baseLevelToLabel))
    .option('--time-format <string>', 'the time format to use if time formatting is enabled', 'isoDateTime')
    .action(action)
    .parseAsync(process.argv)
    .catch(console.error)
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
    timeFormat
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
    timeFormat
  })

  pump(process.stdin, transport)
}

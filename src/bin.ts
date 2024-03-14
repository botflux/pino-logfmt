#!/usr/bin/env node
import { version, description } from "../package.json"
import {program} from "commander";
import createTransport from "./transport";
import pump from "pump";

type ProgramOptions = {
  includeLevelLabel?: boolean
  levelLabelKey?: string
  formatTime?: boolean
  timeKey?: string
  snakeCase?: boolean
  flattenNested?: boolean
  flattenSeparator?: string
}

cli()

function cli () {
  program
    .version(version)
    .description(description)
    .option("--include-level-label", 'add the level as a label', false)
    .option("--level-label-key", 'the key of the level label', "level_label")
    .option("--format-time", "format the timestamp into an ISO date", false)
    .option("--time-key", "the key that holds the timestamp", "time")
    .option("--snake-case", 'convert the keys to snake case', false)
    .option("--flatten-nested", 'flatten nested metadata', false)
    .option("--flatten-separator", "the separator used when flattening nested metadata", ".")
    .action(async (opts: ProgramOptions) => {
      const {
        includeLevelLabel,
        levelLabelKey,
        timeKey,
        formatTime,
        snakeCase: convertToSnakeCase,
        flattenNested: flattenNestedObjects
      } = opts

      const transport = await createTransport({
        includeLevelLabel,
        levelLabelKey,
        timeKey,
        formatTime,
        convertToSnakeCase,
        flattenNestedObjects
      })

      pump(process.stdin, transport)
    })
    .parseAsync(process.argv)
    .catch(console.error)
}
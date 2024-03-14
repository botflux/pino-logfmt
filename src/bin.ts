#!/usr/bin/env node
import { version, description } from "../package.json"
import {program} from "commander";
import createTransport, {baseLevelToLabel} from "./transport";
import pump from "pump";
import {serialize, parse} from "./levels";

type ProgramOptions = {
  includeLevelLabel?: boolean
  levelLabelKey?: string
  formatTime?: boolean
  timeKey?: string
  snakeCase?: boolean
  flattenNested?: boolean
  flattenSeparator?: string
  customLevels?: string
}

cli()

function cli () {
  program
    .version(version)
    .description(description)
    .option("--include-level-label", 'add the level as a label', false)
    .option("--level-label-key <string>", 'the key of the level label', "level_label")
    .option("--format-time", "format the timestamp into an ISO date", false)
    .option("--time-key <string>", "the key that holds the timestamp", "time")
    .option("--snake-case", 'convert the keys to snake case', false)
    .option("--flatten-nested", 'flatten nested metadata', false)
    .option("--flatten-separator <string>", "the separator used when flattening nested metadata", ".")
    .option("--custom-levels, -x <string>", "the levels associated to their labels in the format \"10:trace,20:debug\"", serialize(baseLevelToLabel))
    .action(async (opts: ProgramOptions) => {
      const {
        includeLevelLabel,
        levelLabelKey,
        timeKey,
        formatTime,
        snakeCase: convertToSnakeCase,
        flattenNested: flattenNestedObjects,
        customLevels: serializedCustomLevels
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
        customLevels
      })

      pump(process.stdin, transport)
    })
    .parseAsync(process.argv)
    .catch(console.error)
}
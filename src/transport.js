import SonicBoom from "sonic-boom";
import { once } from "node:events"
import build from "pino-abstract-transport";
import logfmt from "logfmt"
import { snakeCase } from "case-anything"
import {treeToKeyValue} from "./tree-to-key-value.js";

/**
 *
 * @type {Record<number, string>}
 */
export const baseLevelToLabel = {
  10: "trace",
  20: "debug",
  30: "info",
  40: "warn",
  50: "error",
  60: "fatal",
}

/**
 *
 * @param {LogFmtTransportOptions} opts
 * @returns {Promise<Transform & build.OnUnknown>}
 */
export default async function (opts  = {}) {
  const {
    includeLevelLabel,
    levelLabelKey = "level_label",
    formatTime,
    timeKey = "time",
    convertToSnakeCase,
    flattenNestedObjects,
    flattenNestedSeparator,
    customLevels =  baseLevelToLabel
  } = opts

  // SonicBoom is necessary to avoid loops with the main thread.
  // It is the same of pino.destination().
  const destination = new SonicBoom({
    dest: opts.destination || 1,
    sync: opts.sync ?? false,
  })
  await once(destination, 'ready')

  return build(async function (source) {
    for await (let obj of source) {
      if (includeLevelLabel === true) {
        obj[levelLabelKey] = customLevels[obj.level] ?? "unknown"
      }

      if (formatTime === true) {
        obj[timeKey] = new Date(obj[timeKey]).toISOString()
      }

      // treeToKeyValue transforms the field name to snake case
      // if flattenNestedObjects is enabled.
      if (convertToSnakeCase === true && flattenNestedObjects !== true) {
        for (const field in obj) {
          const snakeCaseName = snakeCase(field)

          if (snakeCaseName !== field) {
            obj[snakeCase(field)] = obj[field]
            delete obj[field]
          }
        }
      }

      if (flattenNestedObjects === true) {
        obj = treeToKeyValue(obj, flattenNestedSeparator, convertToSnakeCase)
      }

      const toDrain = !destination.write(logfmt.stringify(obj) + '\n')
      // This block will handle backpressure
      if (toDrain) {
        await once(destination, 'drain')
      }
    }
  }, {
    async close (err) {
      destination.end()
      await once(destination, 'close')
    }
  })
}
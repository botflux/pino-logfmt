import SonicBoom from "sonic-boom";
import { once } from "node:events"
import build from "pino-abstract-transport";
import { stringify } from "logfmt"

export type LogFmtTransportOptions = {
  /**
   * The destination where the logs are written.
   * You can pass a path to a file, or you can pass a number
   * representing the stream to write to.
   *
   * The following example writes in a file named "app.log".
   * ```
   * {
   *  destination: "app.log"
   * }
   * ```
   *
   * You can specify "1" to write into STDOUT.
   * ```
   * {
   *   destination: 1
   * }
   * ```
   *
   * @default {1}
   */
  destination?: string | number

  /**
   * True if the writing must be synchronous.
   *
   * @default {false}
   */
  sync?: boolean

  /**
   * Include the level label in the log line.
   *
   * @default {false}
   */
  includeLevelLabel?: boolean

  /**
   * Specifies the key of the level label.
   *
   * @default {levelLabel}
   */
  levelLabelKey?: string

  /**
   * True if the time must be outputted as an ISO string.
   *
   * @default {false}
   */
  formatTime?: boolean

  /**
   * The key that holds the timestamp of the log.
   *
   * @default {"time"}
   */
  timeKey?: string
}

const levelToLabel: Record<number, string> = {
  10: "trace",
  20: "debug",
  30: "info",
  40: "warn",
  50: "error",
  60: "fatal",
}

export default async function (opts: LogFmtTransportOptions = {}) {
  const {
    includeLevelLabel,
    levelLabelKey = "level_label",
    formatTime,
    timeKey = "time"
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
        obj[levelLabelKey] = levelToLabel[obj.level] ?? "unknown"
      }

      if (formatTime === true) {
        obj[timeKey] = new Date(obj[timeKey]).toISOString()
      }

      const toDrain = !destination.write(stringify(obj) + '\n')
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
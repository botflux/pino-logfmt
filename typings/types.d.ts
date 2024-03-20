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
   * The time format used to format time.
   * You can pass any format accepted by the node module `dateformat`.
   *
   * @default {"isoDateTime"}
   */
  timeFormat?: string

  /**
   * The key that holds the timestamp of the log.
   *
   * @default {"time"}
   */
  timeKey?: string

  /**
   * Enable the metadata names conversions from camel case
   * to snake case.
   *
   * @default {false}
   */
  convertToSnakeCase?: boolean

  /**
   * Flatten metadata into a simple key value dictionary.
   *
   * @default {false}
   */
  flattenNestedObjects?: boolean

  /**
   * The separator character used for flattening the nested metadata.
   */
  flattenNestedSeparator?: string

  /**
   * Override the default level mapping.
   * Here is the default mapping:
   * ```
   * {
   *   10: "trace",
   *   20: "debug",
   *   30: "info",
   *   40: "warn",
   *   50: "error",
   *   60: "fatal",
   * }
   * ```
   *
   * Below, an example showing how to derive the default mapping to add
   * a custom "critic" level.
   *
   * ```
   * import { baseLevelToLabel } from "pino-logfmt"
   *
   * const newLevels: Record<number, string> = {
   *    ...baseLevelToLabel,
   *    55: "critical"
   * }
   * ```
   */
  customLevels?: Record<number, string>
}
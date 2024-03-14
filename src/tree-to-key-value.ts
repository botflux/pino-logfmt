import {snakeCase} from "case-anything";

/**
 * Flatten a tree into a key value dictionary.
 *
 * @param source
 * @param separator
 * @param convertNamesToSnakeCase
 * @param prefixes
 */
export function treeToKeyValue(source: Record<string, unknown>, separator: string = "_", convertNamesToSnakeCase: boolean = true, prefixes: string[] = []): Record<string, unknown> {
  const output: Record<string, unknown> = {}

  for (const key in source) {
    const formattedKey = convertNamesToSnakeCase
      ? snakeCase(key)
      : key

    if (typeof source[key] === "object" && !Array.isArray(source[key])) {
      Object.assign(
        output,
        treeToKeyValue(
          source[key] as Record<string, unknown>,
          separator,
          convertNamesToSnakeCase,
          [...prefixes, formattedKey]
        )
      )
    } else {
      output[[...prefixes, formattedKey].join(separator)] = source[key]
    }
  }

  return output
}
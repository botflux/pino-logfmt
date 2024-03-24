import { snakeCase } from 'case-anything'

/**
 * Flatten a tree into a key value dictionary.
 *
 * @param {Record<string, unknown>} source
 * @param {string} separator
 * @param {boolean} convertNamesToSnakeCase
 * @param {string[]} prefixes
 * @returns {Record<string, unknown>}
 */
export function treeToKeyValue (source, separator = '_', convertNamesToSnakeCase = true, prefixes = []) {
  /**
   * @type {Record<string, unknown>}
   */
  const output = {}

  for (const key in source) {
    const formattedKey = convertNamesToSnakeCase
      ? snakeCase(key)
      : key

    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      Object.assign(
        output,
        treeToKeyValue(
          source[key],
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

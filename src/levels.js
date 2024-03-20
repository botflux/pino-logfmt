/**
 * Serialize levels to labels mapping.
 *
 * @param {Record<number, string>} levelsToLabels
 * @returns {string}
 */
export function serialize (levelsToLabels) {
  return Object.entries(levelsToLabels)
    .map (([key, value]) => `${key}:${value}`)
    .join(",")
}

export class InvalidLevelLabelFormatError extends Error {
  name = InvalidLevelLabelFormatError.name

  constructor() {
    super("An invalid level to label mapping was passed, the correct format is \"<level>:<label>\". Such as \"10:trace,20:debug,30:info\"");
  }
}

/**
 * Parse serialized level to label.
 *
 * @param {string }serialized
 * @returns {Record<number, string>}
 */
export function parse(serialized) {
  if (!isFormatValid(serialized))
    throw new InvalidLevelLabelFormatError()

  return Object.fromEntries(serialized.split(",")
    .map(levelAndLabel => levelAndLabel.split(":"))
    .map(([level, label]) => [parseInt(level), label]))
}

/**
 * Verify that the format is correct.
 *
 * @param {string} serialized
 * @returns {boolean}
 */
function isFormatValid (serialized) {
  const regex = /^((\d+):(\w+),?)+$/i
  return regex.test(serialized)
}
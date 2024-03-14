/**
 * Serialize levels to labels mapping.
 *
 * @param levelsToLabels
 */
export function serialize (levelsToLabels: Record<number, string>): string {
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
 * @param serialized
 */
export function parse(serialized: string): Record<number, string> {
  if (!isFormatValid(serialized))
    throw new InvalidLevelLabelFormatError()

  return Object.fromEntries(serialized.split(",")
    .map(levelAndLabel => levelAndLabel.split(":"))
    .map(([level, label]) => [parseInt(level), label]))
}

/**
 * Verify that the format is correct.
 *
 * @param serialized
 */
function isFormatValid (serialized: string) {
  const regex = /^((\d+):(\w+),?)+$/i
  return regex.test(serialized)
}
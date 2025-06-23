import { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import { parse } from '../src/levels.js'

describe('levels parsing', function () {
  it('should be able to parse a custom level', function () {
    // Given
    // When
    // Then
    assert.deepEqual(parse('10:trace'), { 10: 'trace' })
  })

  it('should be able to parse custom levels', function () {
    // Given
    // When
    // Then
    assert.deepEqual(parse('10:trace,30:info'), { 10: 'trace', 30: 'info' })
  })

  it('should be able to throw an error if the string has the wrong format', function () {
    // Given
    // When
    // Then
    assert.throws(() => parse('hello'), {
      name: 'InvalidLevelLabelFormatError',
      message: 'An invalid level to label mapping was passed, the correct format is "<level>:<label>". Such as "10:trace,20:debug,30:info"'
    })
  })
})

import { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import { treeToKeyValue } from '../src/tree-to-key-value.js'

describe('treeToKeyValue', function () {
  it('should be able to not touch top level fields', function () {
    // Given
    // When
    // Then
    assert.deepEqual(treeToKeyValue({ foo: 'bar' }), { foo: 'bar' })
  })

  it('should be able to flatten nested objects', function () {
    // Given
    // When
    // Then
    assert.deepEqual(treeToKeyValue({ foo: { bar: 'baz' } }), { foo_bar: 'baz' })
  })

  it('should be able to flatten deep nested objects', function () {
    // Given
    // When
    // Then
    assert.deepEqual(treeToKeyValue({ foo: { bar: { baz: 'hello' } } }), { foo_bar_baz: 'hello' })
  })

  it('should be able to transform camel case names to snake case', function () {
    // Given
    // When
    // Then
    assert.deepEqual(treeToKeyValue({ errorName: 'bar' }), { error_name: 'bar' })
  })
})

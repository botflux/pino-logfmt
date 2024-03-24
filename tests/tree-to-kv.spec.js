import { describe, it } from 'mocha'
import { expect } from 'chai'
import { treeToKeyValue } from '../src/tree-to-key-value.js'

describe('treeToKeyValue', function () {
  it('should be able to not touch top level fields', function () {
    // Given
    // When
    // Then
    expect(treeToKeyValue({ foo: 'bar' })).to.deep.equal({ foo: 'bar' })
  })

  it('should be able to flatten nested objects', function () {
    // Given
    // When
    // Then
    expect(treeToKeyValue({ foo: { bar: 'baz' } })).to.deep.equal({ foo_bar: 'baz' })
  })

  it('should be able to flatten deep nested objects', function () {
    // Given
    // When
    // Then
    expect(treeToKeyValue({ foo: { bar: { baz: 'hello' } } })).to.deep.equal({ foo_bar_baz: 'hello' })
  })

  it('should be able to transform camel case names to snake case', function () {
    // Given
    // When
    // Then
    expect(treeToKeyValue({ errorName: 'bar' })).to.deep.equal({ error_name: 'bar' })
  })
})

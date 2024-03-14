import {expect} from "chai";
import {InvalidLevelLabelFormatError, parse} from "../src/levels";


describe('levels parsing', function () {
  it('should be able to parse a custom level', function () {
    // Given
    // When
    // Then
    expect(parse("10:trace")).to.deep.equal({ 10: "trace" })
  })

  it('should be able to parse custom levels', function () {
    // Given
    // When
    // Then
    expect(parse("10:trace,30:info")).to.deep.equal({ 10: "trace", 30: "info" })
  })

  it('should be able to throw an error if the string has the wrong format', function () {
    // Given
    // When
    // Then
    expect(() => parse("hello")).to.throws(
      InvalidLevelLabelFormatError,
      "An invalid level to label mapping was passed, the correct format is \"<level>:<label>\". Such as \"10:trace,20:debug,30:info\""
    )
  })
})
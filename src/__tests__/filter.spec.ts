import { describe, expect, it } from 'vitest'
import { resolveShaderParameters } from '@/utils/filter'

describe('resolveShaderParameters', () => {
  it('maps neutral editor values to neutral shader values', () => {
    expect(
      resolveShaderParameters({
        black: 0,
        whites: 0,
        shadows: 0,
        contrast: 0,
        exposure: 0,
        highlights: 0,
      }),
    ).toEqual({
      black: 0,
      shadows: 0,
      contrast: 1,
      exposure: 1,
      highlights: 0,
      whites: 0,
    })
  })

  it('normalizes signed tonal adjustments', () => {
    expect(
      resolveShaderParameters({
        black: 25,
        whites: 75,
        shadows: 50,
        contrast: -25,
        exposure: 2,
        highlights: -50,
      }),
    ).toEqual({
      black: 0.25,
      shadows: 0.5,
      contrast: 0.75,
      exposure: 4,
      highlights: -0.5,
      whites: 0.75,
    })
  })

  it('maps exposure stops to powers of two', () => {
    expect(
      resolveShaderParameters({
        black: 0,
        whites: 0,
        shadows: 0,
        contrast: 0,
        exposure: -1,
        highlights: 0,
      }).exposure,
    ).toBe(0.5)

    expect(
      resolveShaderParameters({
        black: 0,
        whites: 0,
        shadows: 0,
        contrast: 0,
        exposure: 1,
        highlights: 0,
      }).exposure,
    ).toBe(2)

    expect(
      resolveShaderParameters({
        black: 0,
        whites: 0,
        shadows: 0,
        contrast: 0,
        exposure: -5,
        highlights: 0,
      }).exposure,
    ).toBe(1 / 32)

    expect(
      resolveShaderParameters({
        black: 0,
        whites: 0,
        shadows: 0,
        contrast: 0,
        exposure: 5,
        highlights: 0,
      }).exposure,
    ).toBe(32)
  })
})

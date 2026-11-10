import { describe, expect, it } from 'vitest'
import { locationToRotation, shortestAngleDelta } from './rotation'

describe('shortestAngleDelta', () => {
  it('escolhe o caminho mais curto ao cruzar 0/2π', () => {
    expect(shortestAngleDelta(0.1, Math.PI * 2 - 0.1)).toBeCloseTo(-0.2)
    expect(shortestAngleDelta(Math.PI * 2 - 0.1, 0.1)).toBeCloseTo(0.2)
  })

  it('ignora voltas completas acumuladas', () => {
    expect(shortestAngleDelta(Math.PI * 10, Math.PI * 10 + 0.5)).toBeCloseTo(0.5)
  })
})

describe('locationToRotation', () => {
  it('usa a latitude como inclinação (theta)', () => {
    expect(locationToRotation(0, 0).theta).toBe(0)
    expect(locationToRotation(90, 0).theta).toBeCloseTo(Math.PI / 2)
  })

  it('desloca phi conforme a longitude', () => {
    const a = locationToRotation(0, 0).phi
    const b = locationToRotation(0, 90).phi
    expect(a - b).toBeCloseTo(Math.PI / 2)
  })
})

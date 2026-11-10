import { describe, expect, it } from 'vitest'
import { formatCoordinates } from './formatCoordinates'

describe('formatCoordinates', () => {
  it('converte sinais em hemisférios', () => {
    expect(formatCoordinates({ lat: '-37.3159', lng: '81.1496' })).toBe('37.32°S 81.15°E')
    expect(formatCoordinates({ lat: '29.4572', lng: '-164.2990' })).toBe('29.46°N 164.30°W')
  })
})

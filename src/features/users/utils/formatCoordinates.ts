import type { Geo } from '../types/user'

function formatAxis(value: number, positive: string, negative: string): string {
  const hemisphere = value >= 0 ? positive : negative
  return `${Math.abs(value).toFixed(2)}°${hemisphere}`
}

/** { lat: "-37.3159", lng: "81.1496" } → "37.32°S 81.15°E" */
export function formatCoordinates(geo: Geo): string {
  return `${formatAxis(Number(geo.lat), 'N', 'S')} ${formatAxis(Number(geo.lng), 'E', 'W')}`
}

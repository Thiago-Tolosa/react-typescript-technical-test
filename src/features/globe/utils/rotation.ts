export interface Rotation {
  phi: number
  theta: number
}

const DEG = Math.PI / 180

/** Ângulos (phi/theta do cobe) que deixam a coordenada no centro do globo. */
export function locationToRotation(lat: number, lng: number): Rotation {
  return {
    phi: Math.PI - (lng * DEG - Math.PI / 2),
    theta: lat * DEG,
  }
}

/** Menor diferença angular entre dois ângulos, em [-π, π]. Evita dar a volta inteira no globo. */
export function shortestAngleDelta(from: number, to: number): number {
  const full = Math.PI * 2
  const delta = (((to - from) % full) + full) % full
  return delta > Math.PI ? delta - full : delta
}

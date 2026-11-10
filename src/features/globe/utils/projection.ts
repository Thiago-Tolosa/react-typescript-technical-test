import { GLOBE_RADIUS, MARKER_ELEVATION } from '../config'
import type { GlobePoint } from '../types'
import type { Rotation } from './rotation'

export interface ScreenPosition {
  /** 0 = borda esquerda, 1 = borda direita do canvas. */
  x: number
  /** 0 = topo, 1 = base do canvas. */
  y: number
  /** false quando o ponto está atrás do globo. */
  visible: boolean
}

const DEG = Math.PI / 180

/** lat/lng → vetor 3D, na mesma convenção do cobe. */
function toCartesian(lat: number, lng: number): [number, number, number] {
  const latRad = lat * DEG
  const lngRad = lng * DEG - Math.PI
  const cosLat = Math.cos(latRad)
  return [-cosLat * Math.cos(lngRad), Math.sin(latRad), cosLat * Math.sin(lngRad)]
}

/**
 * Onde um ponto aparece no canvas para uma dada rotação.
 * Reproduz a projeção interna do cobe (que não expõe API de clique).
 */
export function projectPoint(lat: number, lng: number, { phi, theta }: Rotation): ScreenPosition {
  const radius = GLOBE_RADIUS + MARKER_ELEVATION
  const [px, py, pz] = toCartesian(lat, lng).map((v) => v * radius)

  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)

  const x = cosPhi * px + sinPhi * pz
  const y = sinPhi * sinTheta * px + cosTheta * py - cosPhi * sinTheta * pz
  const depth = -sinPhi * cosTheta * px + sinTheta * py + cosPhi * cosTheta * pz

  return {
    x: (x + 1) / 2,
    y: (-y + 1) / 2,
    // Mesmo critério do cobe: na frente, ou na borda (fora do disco).
    visible: depth >= 0 || x * x + y * y >= GLOBE_RADIUS ** 2,
  }
}

/**
 * Ponto visível mais próximo do cursor, dentro do raio de clique.
 * `pointer` e `maxDistance` são normalizados pelo tamanho do canvas (0–1).
 */
export function findPointAt(
  points: GlobePoint[],
  rotation: Rotation,
  pointer: { x: number; y: number },
  maxDistance: number,
): GlobePoint | null {
  let nearest: GlobePoint | null = null
  let nearestDistance = maxDistance

  for (const point of points) {
    const screen = projectPoint(point.lat, point.lng, rotation)
    if (!screen.visible) continue

    const distance = Math.hypot(screen.x - pointer.x, screen.y - pointer.y)
    if (distance <= nearestDistance) {
      nearest = point
      nearestDistance = distance
    }
  }

  return nearest
}

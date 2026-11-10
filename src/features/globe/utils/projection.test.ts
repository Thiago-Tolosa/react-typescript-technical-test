import { describe, expect, it } from 'vitest'
import type { GlobePoint } from '../types'
import { findPointAt, projectPoint } from './projection'
import { locationToRotation } from './rotation'

const leanne: GlobePoint = { id: 1, lat: -37.3159, lng: 81.1496 }
const ervin: GlobePoint = { id: 2, lat: -43.9509, lng: -34.4618 }

describe('projectPoint', () => {
  it('coloca no centro do canvas o ponto para o qual o globo foi girado', () => {
    const screen = projectPoint(leanne.lat, leanne.lng, locationToRotation(leanne.lat, leanne.lng))

    expect(screen.x).toBeCloseTo(0.5)
    expect(screen.y).toBeCloseTo(0.5)
    expect(screen.visible).toBe(true)
  })

  it('marca como invisível o ponto do lado oposto do globo', () => {
    const rotation = locationToRotation(leanne.lat, leanne.lng)
    const opposite = projectPoint(-leanne.lat, leanne.lng + 180, rotation)

    expect(opposite.visible).toBe(false)
  })

  it('aumentar phi move os pontos da frente para a direita (arraste para a direita)', () => {
    const rotation = locationToRotation(leanne.lat, leanne.lng)
    const moved = projectPoint(leanne.lat, leanne.lng, { ...rotation, phi: rotation.phi + 0.2 })

    expect(moved.x).toBeGreaterThan(0.5)
  })
})

describe('findPointAt', () => {
  const points = [leanne, ervin]
  const facingLeanne = locationToRotation(leanne.lat, leanne.lng)

  it('encontra o ponto sob o cursor', () => {
    expect(findPointAt(points, facingLeanne, { x: 0.5, y: 0.5 }, 0.05)?.id).toBe(1)
  })

  it('aceita cliques um pouco fora do ponto, dentro do raio', () => {
    expect(findPointAt(points, facingLeanne, { x: 0.53, y: 0.5 }, 0.05)?.id).toBe(1)
  })

  it('retorna null longe de qualquer ponto', () => {
    expect(findPointAt(points, facingLeanne, { x: 0.1, y: 0.1 }, 0.05)).toBeNull()
  })

  it('ignora pontos escondidos atrás do globo', () => {
    // Girado para o lado oposto: a Leanne fica atrás, exatamente no centro "por trás".
    const facingAway = locationToRotation(-leanne.lat, leanne.lng + 180)
    expect(findPointAt([leanne], facingAway, { x: 0.5, y: 0.5 }, 0.05)).toBeNull()
  })
})

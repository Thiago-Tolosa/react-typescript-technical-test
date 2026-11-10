import createGlobe, { type Globe, type Marker } from 'cobe'
import { useEffect, useRef, type RefObject } from 'react'
import { MARKER_ELEVATION } from '../config'
import { shortestAngleDelta, type Rotation } from '../utils/rotation'

interface UseCobeGlobeOptions {
  /** Largura em px (o globo é quadrado). 0 = ainda não medido. */
  size: number
  markers: Marker[]
  /** Rotação alvo; null = girar livremente. */
  target: Rotation | null
  autoRotate: boolean
}

export interface GlobeControl {
  /** Enquanto true (cursor sobre o globo), nada gira sozinho: o usuário está no controle. */
  userControlled: boolean
}

const RESTING_THETA = 0.25
const EASING = 0.08
const SPIN_SPEED = 0.0025

/**
 * Encapsula a parte imperativa (WebGL + requestAnimationFrame) do cobe.
 * O globo é criado uma única vez; mudanças de props chegam via refs/`update`,
 * sem recriar o contexto WebGL a cada render.
 *
 * Devolve a rotação atual (mutável) para quem precisa ler ou arrastar o globo.
 */
export function useCobeGlobe(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { size, markers, target, autoRotate }: UseCobeGlobeOptions,
) {
  const globeRef = useRef<Globe | null>(null)
  const rotationRef = useRef<Rotation>({ phi: 0, theta: RESTING_THETA })
  const controlRef = useRef<GlobeControl>({ userControlled: false })
  const motionRef = useRef({ target, autoRotate })
  const markersRef = useRef(markers)

  // Sincroniza os valores lidos pelo loop de animação.
  useEffect(() => {
    motionRef.current = { target, autoRotate }
  }, [target, autoRotate])

  useEffect(() => {
    markersRef.current = markers
    globeRef.current?.update({ markers })
  }, [markers])

  const hasSize = size > 0

  // Criação e loop de animação.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !hasSize) return

    const width = canvas.offsetWidth
    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: rotationRef.current.phi,
      theta: rotationRef.current.theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5,
      mapBaseBrightness: 0.03,
      baseColor: [0.22, 0.22, 0.24],
      markerColor: [0.62, 0.61, 0.59],
      glowColor: [0.07, 0.07, 0.08],
      markerElevation: MARKER_ELEVATION,
      markers: markersRef.current,
    })
    globeRef.current = globe

    let frame = 0
    const tick = () => {
      const rotation = rotationRef.current
      const { target, autoRotate } = motionRef.current

      if (controlRef.current.userControlled) {
        // A rotação só muda pelo arraste (feito por quem controla).
      } else if (target) {
        rotation.phi += shortestAngleDelta(rotation.phi, target.phi) * EASING
        rotation.theta += (target.theta - rotation.theta) * EASING
      } else {
        if (autoRotate) rotation.phi += SPIN_SPEED
        rotation.theta += (RESTING_THETA - rotation.theta) * 0.03
      }

      globe.update({ phi: rotation.phi, theta: rotation.theta })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      globe.destroy()
      globeRef.current = null
    }
  }, [canvasRef, hasSize])

  // Redimensiona sem recriar.
  useEffect(() => {
    if (size > 0) globeRef.current?.update({ width: size, height: size })
  }, [size])

  return { rotationRef, controlRef }
}

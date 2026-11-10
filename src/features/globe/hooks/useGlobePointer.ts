import { useRef, type PointerEvent, type RefObject } from 'react'
import { HIT_RADIUS_PX } from '../config'
import type { GlobePoint } from '../types'
import { findPointAt } from '../utils/projection'
import type { Rotation } from '../utils/rotation'
import type { GlobeControl } from './useCobeGlobe'

interface UseGlobePointerOptions {
  points: GlobePoint[]
  rotationRef: RefObject<Rotation>
  controlRef: RefObject<GlobeControl>
  onPointHover?: (id: number | null) => void
  onPointSelect?: (id: number) => void
}

interface DragState {
  pointerId: number
  startX: number
  startY: number
  startRotation: Rotation
  moved: boolean
}

/** Abaixo disso (px), o gesto conta como clique e não como arraste. */
const DRAG_THRESHOLD_PX = 4
/** Limite de inclinação para o globo não "virar de cabeça para baixo". */
const MAX_THETA = 1

/**
 * Interação com o globo via Pointer Events (mouse, caneta e toque):
 * - passar sobre um ponto → `onPointHover`
 * - clicar num ponto → `onPointSelect`
 * - arrastar → gira o globo
 *
 * Devolve os handlers para espalhar no <canvas>, ou `undefined` se não houver callbacks.
 */
export function useGlobePointer({
  points,
  rotationRef,
  controlRef,
  onPointHover,
  onPointSelect,
}: UseGlobePointerOptions) {
  const dragRef = useRef<DragState | null>(null)
  const hoveredRef = useRef<number | null>(null)

  if (!onPointHover && !onPointSelect) return undefined

  function pointAt(event: PointerEvent<HTMLCanvasElement>): GlobePoint | null {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width === 0) return null

    const pointer = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }
    return findPointAt(points, rotationRef.current, pointer, HIT_RADIUS_PX / rect.width)
  }

  function setHovered(id: number | null, canvas: HTMLCanvasElement) {
    canvas.style.cursor = dragRef.current?.moved ? 'grabbing' : id !== null ? 'pointer' : 'grab'
    if (hoveredRef.current === id) return
    hoveredRef.current = id
    onPointHover?.(id)
  }

  return {
    onPointerEnter() {
      controlRef.current.userControlled = true
    },

    onPointerLeave(event: PointerEvent<HTMLCanvasElement>) {
      if (dragRef.current) return
      controlRef.current.userControlled = false
      setHovered(null, event.currentTarget)
    },

    onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startRotation: { ...rotationRef.current },
        moved: false,
      }
    },

    onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
      const drag = dragRef.current
      const canvas = event.currentTarget

      if (drag && drag.pointerId === event.pointerId) {
        const dx = event.clientX - drag.startX
        const dy = event.clientY - drag.startY
        if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return

        drag.moved = true
        // Atravessar a largura inteira do globo = meia volta.
        const radiansPerPx = Math.PI / canvas.offsetWidth
        rotationRef.current.phi = drag.startRotation.phi + dx * radiansPerPx
        rotationRef.current.theta = Math.max(
          -MAX_THETA,
          Math.min(MAX_THETA, drag.startRotation.theta + dy * radiansPerPx),
        )
        setHovered(null, canvas)
        return
      }

      setHovered(pointAt(event)?.id ?? null, canvas)
    },

    onPointerUp(event: PointerEvent<HTMLCanvasElement>) {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      dragRef.current = null

      const canvas = event.currentTarget
      canvas.releasePointerCapture(event.pointerId)

      const point = pointAt(event)
      if (!drag.moved && point) onPointSelect?.(point.id)
      setHovered(point?.id ?? null, canvas)
    },

    onPointerCancel() {
      dragRef.current = null
    },
  }
}

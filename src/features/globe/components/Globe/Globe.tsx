import type { Marker } from 'cobe'
import { useMemo, useRef, type CSSProperties } from 'react'
import { useElementWidth } from '../../../../hooks/useElementWidth'
import { useMediaQuery } from '../../../../hooks/useMediaQuery'
import { useCobeGlobe } from '../../hooks/useCobeGlobe'
import { useGlobePointer } from '../../hooks/useGlobePointer'
import type { GlobePoint } from '../../types'
import { locationToRotation } from '../../utils/rotation'
import styles from './Globe.module.css'

export interface GlobeProps {
  points: GlobePoint[]
  /** O globo gira até este ponto. */
  focusedId?: number | null
  /**
   * Ponto pintado de destaque e com etiqueta. Padrão: o `focusedId`.
   * Separado do foco porque o destaque vindo do próprio globo (hover)
   * não deve girá-lo — o ponto fugiria do cursor.
   */
  highlightedId?: number | null
  /** Texto exibido junto ao ponto destacado. */
  highlightedLabel?: string
  autoRotate?: boolean
  /** Habilitam a interação: hover, clique e arraste. */
  onPointHover?: (id: number | null) => void
  onPointSelect?: (id: number) => void
}

const ACCENT: [number, number, number] = [1, 0.42, 0.17]
const markerAnchorId = (id: number) => `point-${id}`

export function Globe({
  points,
  focusedId = null,
  highlightedId = focusedId,
  highlightedLabel,
  autoRotate = true,
  onPointHover,
  onPointSelect,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = useElementWidth(containerRef)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const focused = points.find((point) => point.id === focusedId) ?? null
  const highlighted = points.find((point) => point.id === highlightedId) ?? null

  const markers = useMemo<Marker[]>(
    () =>
      points.map((point) =>
        point.id === highlightedId
          ? { location: [point.lat, point.lng], size: 0.09, color: ACCENT, id: markerAnchorId(point.id) }
          : { location: [point.lat, point.lng], size: 0.045 },
      ),
    [points, highlightedId],
  )

  const target = useMemo(
    () => (focused ? locationToRotation(focused.lat, focused.lng) : null),
    [focused],
  )

  const { rotationRef, controlRef } = useCobeGlobe(canvasRef, {
    size,
    markers,
    target,
    autoRotate: autoRotate && !reducedMotion,
  })

  const pointerHandlers = useGlobePointer({
    points,
    rotationRef,
    controlRef,
    onPointHover,
    onPointSelect,
  })

  const anchor = highlighted ? markerAnchorId(highlighted.id) : null

  return (
    <div ref={containerRef} className={styles.globe}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-ready={size > 0}
        data-interactive={Boolean(pointerHandlers)}
        aria-hidden="true"
        {...pointerHandlers}
      />
      {anchor && highlightedLabel && (
        <span
          className={styles.label}
          style={
            {
              '--anchor': `--cobe-${anchor}`,
              '--visible': `var(--cobe-visible-${anchor}, 0)`,
            } as CSSProperties
          }
        >
          {highlightedLabel}
        </span>
      )}
    </div>
  )
}

export default Globe

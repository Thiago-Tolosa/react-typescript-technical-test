import type { Marker } from 'cobe'
import { useMemo, useRef, type CSSProperties } from 'react'
import { useElementWidth } from '../../../../hooks/useElementWidth'
import { useMediaQuery } from '../../../../hooks/useMediaQuery'
import { useCobeGlobe } from '../../hooks/useCobeGlobe'
import type { GlobePoint } from '../../types'
import { locationToRotation } from '../../utils/rotation'
import styles from './Globe.module.css'

export interface GlobeProps {
  points: GlobePoint[]
  /** Ponto destacado: o globo gira até ele. */
  focusedId?: number | null
  /** Texto exibido junto ao ponto destacado. */
  focusedLabel?: string
  autoRotate?: boolean
}

const ACCENT: [number, number, number] = [1, 0.42, 0.17]
const markerAnchorId = (id: number) => `point-${id}`

export function Globe({ points, focusedId = null, focusedLabel, autoRotate = true }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = useElementWidth(containerRef)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const focused = points.find((point) => point.id === focusedId) ?? null

  const markers = useMemo<Marker[]>(
    () =>
      points.map((point) =>
        point.id === focusedId
          ? { location: [point.lat, point.lng], size: 0.09, color: ACCENT, id: markerAnchorId(point.id) }
          : { location: [point.lat, point.lng], size: 0.045 },
      ),
    [points, focusedId],
  )

  const target = useMemo(
    () => (focused ? locationToRotation(focused.lat, focused.lng) : null),
    [focused],
  )

  useCobeGlobe(canvasRef, {
    size,
    markers,
    target,
    autoRotate: autoRotate && !reducedMotion,
  })

  const anchor = focused ? markerAnchorId(focused.id) : null

  return (
    <div ref={containerRef} className={styles.globe}>
      <canvas ref={canvasRef} className={styles.canvas} data-ready={size > 0} aria-hidden="true" />
      {anchor && focusedLabel && (
        <span
          className={styles.label}
          style={
            {
              '--anchor': `--cobe-${anchor}`,
              '--visible': `var(--cobe-visible-${anchor}, 0)`,
            } as CSSProperties
          }
        >
          {focusedLabel}
        </span>
      )}
    </div>
  )
}

export default Globe

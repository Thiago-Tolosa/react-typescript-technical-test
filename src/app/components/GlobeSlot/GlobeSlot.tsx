import { Suspense } from 'react'
import { Globe, type GlobeProps } from '../../../features/globe'
import styles from './GlobeSlot.module.css'

/** Globo com fallback enquanto o chunk do WebGL carrega. */
export function GlobeSlot(props: GlobeProps) {
  return (
    <Suspense fallback={<div className={styles.placeholder} aria-hidden="true" />}>
      <Globe {...props} />
    </Suspense>
  )
}

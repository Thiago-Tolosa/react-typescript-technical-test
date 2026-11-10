import { lazy } from 'react'

export type { GlobeProps } from './components/Globe/Globe'
export type { GlobePoint } from './types'

/**
 * Carregado sob demanda: o WebGL não pesa no bundle inicial
 * e a lista aparece antes do globo.
 */
export const Globe = lazy(() => import('./components/Globe/Globe'))

import type { ReactNode } from 'react'
import styles from './StatusMessage.module.css'

interface StatusMessageProps {
  code: string
  title: string
  description?: ReactNode
  tone?: 'neutral' | 'danger'
  action?: ReactNode
}

/** Bloco para estados vazios e de erro. */
export function StatusMessage({
  code,
  title,
  description,
  tone = 'neutral',
  action,
}: StatusMessageProps) {
  return (
    <div className={styles.root} data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className={styles.code}>{code}</span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}

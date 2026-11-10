import { Skeleton } from '../../../../components/Skeleton'
import styles from './UserListSkeleton.module.css'

interface UserListSkeletonProps {
  rows?: number
}

/** Espelha o layout de UserRow para a troca não "pular" na tela. */
export function UserListSkeleton({ rows = 8 }: UserListSkeletonProps) {
  return (
    <div className={styles.list} role="status" aria-live="polite">
      <span className="visually-hidden">Carregando usuários…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={styles.row} style={{ opacity: 1 - index * 0.1 }}>
          <Skeleton width={16} height={10} className={styles.position} />
          <Skeleton width={36} height={36} />
          <div className={styles.stack}>
            <Skeleton width={`${55 - (index % 3) * 10}%`} height={12} />
            <Skeleton width={`${40 + (index % 2) * 12}%`} height={10} />
          </div>
          <div className={`${styles.stack} ${styles.meta}`}>
            <Skeleton width="50%" height={10} />
            <Skeleton width="70%" height={10} />
          </div>
        </div>
      ))}
    </div>
  )
}

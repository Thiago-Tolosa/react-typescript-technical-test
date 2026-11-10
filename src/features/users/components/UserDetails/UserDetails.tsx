import type { ReactNode } from 'react'
import { Button } from '../../../../components/Button'
import type { User } from '../../types/user'
import { formatCoordinates } from '../../utils/formatCoordinates'
import { getInitials } from '../../utils/getInitials'
import styles from './UserDetails.module.css'

interface UserDetailsProps {
  user: User
  titleId: string
  onClose: () => void
  /** Conteúdo extra ao lado dos dados (ex.: globo). Mantém esta feature desacoplada. */
  aside?: ReactNode
}

/** Telefones da API vêm como "1-770-736-8031 x56442"; o link tel: usa só a parte discável. */
function toTelHref(phone: string): string {
  const [number] = phone.split(/\s*x/i)
  return `tel:${number.replace(/[^\d+]/g, '')}`
}

export function UserDetails({ user, titleId, onClose, aside }: UserDetailsProps) {
  const { address, company } = user

  return (
    <article className={styles.details}>
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(user.name)}
        </span>
        <div className={styles.heading}>
          <span className={styles.kicker}>
            REG. {String(user.id).padStart(2, '0')} · @{user.username}
          </span>
          <h2 id={titleId} className={styles.title}>
            {user.name}
          </h2>
        </div>
        <Button variant="ghost" onClick={onClose} aria-label="Fechar detalhes">
          esc
        </Button>
      </header>

      <div className={styles.body}>
        <dl className={styles.fields}>
          <div className={styles.field}>
            <dt>Nome completo</dt>
            <dd>{user.name}</dd>
          </div>
          <div className={styles.field}>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Telefone</dt>
            <dd>
              <a href={toTelHref(user.phone)}>{user.phone}</a>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Empresa</dt>
            <dd>
              {company.name}
              <span className={styles.secondary}>“{company.catchPhrase}”</span>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Cidade</dt>
            <dd>
              {address.city}
              <span className={styles.secondary}>
                {address.street}, {address.suite} · {address.zipcode}
              </span>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Website</dt>
            <dd>
              <a href={`https://${user.website}`} target="_blank" rel="noreferrer">
                {user.website}
              </a>
            </dd>
          </div>
        </dl>

        {aside && (
          <aside className={styles.aside}>
            {aside}
            <span className={styles.coordinates}>{formatCoordinates(address.geo)}</span>
          </aside>
        )}
      </div>
    </article>
  )
}

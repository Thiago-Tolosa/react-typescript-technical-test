import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id do elemento que dá nome ao diálogo (acessibilidade). */
  labelledBy: string
  children: ReactNode
}

/**
 * Usa o <dialog> nativo: foco preso, Esc e camada superior vêm de graça do navegador.
 */
export function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Clique fora do conteúdo cai no próprio <dialog> (o backdrop).
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.content}>{children}</div>
    </dialog>
  )
}

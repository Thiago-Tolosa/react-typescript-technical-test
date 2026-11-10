/**
 * Indica se o foco atual do elemento é "de teclado" (o navegador mostraria o anel de foco).
 *
 * Diferencia, por exemplo, o Tab de um usuário de teclado do foco que o <dialog>
 * devolve ao botão que o abriu quando o modal é fechado com o mouse.
 */
export function isFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible')
  } catch {
    // Navegadores sem suporte ao seletor: trata todo foco como visível (comportamento anterior).
    return true
  }
}

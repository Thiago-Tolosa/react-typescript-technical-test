import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { usersFixture } from '../../../../test/fixtures/users'
import { UserList } from './UserList'

// Se o foco é "de teclado" quem decide é o navegador (e o jsdom não imita isso bem).
// Aqui fixamos a resposta para testar só a lógica do componente.
const { isFocusVisibleMock } = vi.hoisted(() => ({ isFocusVisibleMock: vi.fn(() => true) }))
vi.mock('../../../../lib/dom/isFocusVisible', () => ({ isFocusVisible: isFocusVisibleMock }))

describe('UserList', () => {
  it('destaca a linha indicada de fora (ex.: hover no globo) e rola até ela', () => {
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<UserList users={usersFixture} onSelect={() => {}} highlightedId={2} revealHighlighted />)

    expect(screen.getByRole('button', { name: /Ervin Howell/ })).toHaveAttribute('data-highlighted')
    expect(screen.getByRole('button', { name: /Leanne Graham/ })).not.toHaveAttribute('data-highlighted')
    expect(scroll).toHaveBeenCalledTimes(1)
  })

  it('não rola quando o destaque não pede para revelar', () => {
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<UserList users={usersFixture} onSelect={() => {}} highlightedId={2} />)

    expect(scroll).not.toHaveBeenCalled()
  })

  it('avisa o hover e o clique', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onHighlight = vi.fn()
    render(<UserList users={usersFixture} onSelect={onSelect} onHighlight={onHighlight} />)

    const row = screen.getByRole('button', { name: /Leanne Graham/ })
    await user.hover(row)
    expect(onHighlight).toHaveBeenLastCalledWith(1)

    await user.click(row)
    expect(onSelect).toHaveBeenCalledWith(usersFixture[0])

    await user.unhover(row)
    expect(onHighlight).toHaveBeenLastCalledWith(null)
  })

  it('foco de teclado destaca a linha e o blur limpa', async () => {
    const user = userEvent.setup()
    const onHighlight = vi.fn()
    render(<UserList users={usersFixture} onSelect={() => {}} onHighlight={onHighlight} />)

    await user.tab()
    expect(onHighlight).toHaveBeenLastCalledWith(1)

    await user.tab()
    expect(onHighlight).toHaveBeenNthCalledWith(2, null)
    expect(onHighlight).toHaveBeenLastCalledWith(2)
  })

  // Regressão: ao fechar o modal com o mouse, o <dialog> devolve o foco à linha
  // que o abriu. Esse foco não pode destacar o usuário (o destaque ficava preso).
  it('foco devolvido sem teclado não destaca a linha', () => {
    const onHighlight = vi.fn()
    render(<UserList users={usersFixture} onSelect={() => {}} onHighlight={onHighlight} />)
    const row = screen.getByRole('button', { name: /Ervin Howell/ })

    isFocusVisibleMock.mockReturnValueOnce(false)
    act(() => row.focus())
    expect(onHighlight).not.toHaveBeenCalled()

    // E o blur desse foco não apaga um destaque que não foi ele que criou.
    act(() => row.blur())
    expect(onHighlight).not.toHaveBeenCalled()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { usersFixture } from '../../../../test/fixtures/users'
import { UserList } from './UserList'

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
})

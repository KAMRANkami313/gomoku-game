import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ModeSelector } from './ModeSelector'

describe('ModeSelector', () => {
  it('renders all three mode buttons', () => {
    const { getByText } = render(
      <ModeSelector mode="ai" onModeChange={() => {}} disabled={false} />,
    )
    expect(getByText('vs AI')).toBeTruthy()
    expect(getByText('2P')).toBeTruthy()
    expect(getByText('Online')).toBeTruthy()
  })

  it('marks ai button as active when mode is ai', () => {
    const { getByText } = render(
      <ModeSelector mode="ai" onModeChange={() => {}} disabled={false} />,
    )
    const aiBtn = getByText('vs AI').closest('button')
    expect(aiBtn?.className).toContain('mode-selector__btn--active')
  })

  it('marks pvp button as active when mode is pvp', () => {
    const { getByText } = render(
      <ModeSelector mode="pvp" onModeChange={() => {}} disabled={false} />,
    )
    const pvpBtn = getByText('2P').closest('button')
    expect(pvpBtn?.className).toContain('mode-selector__btn--active')
  })

  it('marks online button as active when mode is online', () => {
    const { getByText } = render(
      <ModeSelector mode="online" onModeChange={() => {}} disabled={false} />,
    )
    const onlineBtn = getByText('Online').closest('button')
    expect(onlineBtn?.className).toContain('mode-selector__btn--active')
  })

  it('calls onModeChange with ai when ai button clicked', () => {
    const onModeChange = vi.fn()
    const { getByText } = render(
      <ModeSelector mode="pvp" onModeChange={onModeChange} disabled={false} />,
    )
    fireEvent.click(getByText('vs AI'))
    expect(onModeChange).toHaveBeenCalledWith('ai')
  })

  it('calls onModeChange with pvp when pvp button clicked', () => {
    const onModeChange = vi.fn()
    const { getByText } = render(
      <ModeSelector mode="ai" onModeChange={onModeChange} disabled={false} />,
    )
    fireEvent.click(getByText('2P'))
    expect(onModeChange).toHaveBeenCalledWith('pvp')
  })

  it('calls onModeChange with online when online button clicked', () => {
    const onModeChange = vi.fn()
    const { getByText } = render(
      <ModeSelector mode="ai" onModeChange={onModeChange} disabled={false} />,
    )
    fireEvent.click(getByText('Online'))
    expect(onModeChange).toHaveBeenCalledWith('online')
  })

  it('disables buttons when disabled is true', () => {
    const { getByText } = render(
      <ModeSelector mode="ai" onModeChange={() => {}} disabled={true} />,
    )
    const aiBtn = getByText('vs AI').closest('button')
    const pvpBtn = getByText('2P').closest('button')
    const onlineBtn = getByText('Online').closest('button')
    expect(aiBtn?.disabled).toBe(true)
    expect(pvpBtn?.disabled).toBe(true)
    expect(onlineBtn?.disabled).toBe(true)
  })
})
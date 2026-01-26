import { useMemo } from 'react'

type GlowHandlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void
  onTouchStart: (e: React.TouchEvent<HTMLElement>) => void
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void
}

export function useCardGlow(glowColor: string, disabled = false): GlowHandlers {
  return useMemo(() => ({
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled) {
        e.currentTarget.style.boxShadow = `0 8px 32px ${glowColor}, 0 0 20px ${glowColor}`
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.boxShadow = 'none'
    },
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
      if (!disabled) {
        e.currentTarget.style.boxShadow = `0 8px 32px ${glowColor}, 0 0 20px ${glowColor}`
      }
    },
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
      e.currentTarget.style.boxShadow = 'none'
    },
  }), [glowColor, disabled])
}

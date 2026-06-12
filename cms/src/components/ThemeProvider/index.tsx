'use client'
import React, { useEffect } from 'react'

// Only inject Payload's internal success-colour palette so its own
// components (toasts, toggles, etc.) use the brand green.
// All visual styling lives in admin-theme.css.
// Injected via JS to guarantee it wins over Payload's @layer payload-default
const NAV_FIX_CSS = `
  /* Kill the 60px gutter-h left indent on the nav scroll area */
  aside.nav .nav__scroll,
  .nav .nav__scroll {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-inline-start: 0 !important;
    padding-inline-end: 0 !important;
  }
  /* Fix relationship field value clipping:
     Payload sets text-align:center on rs__value-container (inherited),
     relationship--single-value__text has overflow:hidden,
     relationship--multi-value-label__content has max-width:150px */
  .rs__value-container {
    text-align: left !important;
  }
  .relationship--single-value__text {
    overflow: visible !important;
    text-overflow: unset !important;
  }
  .relationship--multi-value-label__content {
    max-width: none !important;
  }
  .rs__single-value {
    overflow: visible !important;
  }
`

const PALETTE_CSS = `
  html[data-theme='light'], html[data-theme='dark'] {
    --color-success-50:  #f0fdf4;
    --color-success-100: #dcfce7;
    --color-success-200: #bbf7d0;
    --color-success-300: #86efac;
    --color-success-400: #4ade80;
    --color-success-500: #22c55e;
    --color-success-600: #16a34a;
    --color-success-700: #15803d;
    --color-success-800: #166534;
    --color-success-900: #14532d;
  }
`

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const existing = document.getElementById('sg-palette')
    if (existing) return
    const style = document.createElement('style')
    style.id = 'sg-palette'
    style.textContent = PALETTE_CSS
    document.head.appendChild(style)
    return () => { document.getElementById('sg-palette')?.remove() }
  }, [])

  useEffect(() => {
    const existing = document.getElementById('sg-nav-fix')
    if (existing) return
    const style = document.createElement('style')
    style.id = 'sg-nav-fix'
    style.textContent = NAV_FIX_CSS
    document.head.appendChild(style)
    return () => { document.getElementById('sg-nav-fix')?.remove() }
  }, [])

  return <>{children}</>
}

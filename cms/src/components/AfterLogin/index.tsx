'use client'
import React, { useEffect } from 'react'

export default function AfterLogin() {
  useEffect(() => {
    const clean = () => {
      // Hide "Sign Up" tab button
      document.querySelectorAll<HTMLElement>('button, a, li').forEach(el => {
        const txt = el.textContent?.trim().toLowerCase() ?? ''
        if (txt === 'sign up' || txt === 'create account' || txt === 'create first user') {
          el.style.setProperty('display', 'none', 'important')
          // Also hide the parent tab/li wrapper
          const parent = el.closest<HTMLElement>('li, [class*="tab"]')
          if (parent) parent.style.setProperty('display', 'none', 'important')
        }
      })

      // Hide "Don't have an account yet?" bottom line
      document.querySelectorAll<HTMLElement>('p, div, span, a').forEach(el => {
        const txt = el.textContent?.trim().toLowerCase() ?? ''
        if (
          txt.includes("don't have an account") ||
          txt.includes('dont have an account') ||
          txt.includes('sign up') && txt.includes('account')
        ) {
          // Only hide leaf-level or small containers, not the whole form
          if (!el.querySelector('input') && !el.querySelector('button[type="submit"]')) {
            el.style.setProperty('display', 'none', 'important')
          }
        }
      })
    }

    // Run immediately
    clean()

    // Re-run whenever DOM changes (React re-renders the form)
    const obs = new MutationObserver(clean)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [])

  return (
    <style>{`
      /* Login page base styles */
      html, body, body > div, body > div > div {
        background: #ffffff !important;
        background-color: #ffffff !important;
      }

      /* Bigger logo on login page */
      .login img[alt="Satguru DMC"],
      [class*="login"] img[alt="Satguru DMC"],
      .template-minimal img[alt="Satguru DMC"],
      img[alt="Satguru DMC"] {
        height: 90px !important;
        max-width: 260px !important;
        width: auto !important;
      }

      /* Hide Sign Up tab — belt-and-suspenders CSS fallback */
      .login__tabs a:last-child,
      .login__tabs li:last-child,
      .login__tabs button:last-child,
      [class*="login"] [class*="tab"]:last-child,
      [class*="tabs"] [class*="tab"]:last-child:not(:first-child),
      a[href*="create-first-user"],
      a[href*="signup"],
      a[href*="sign-up"] {
        display: none !important;
      }

      /* Hide "Don't have an account yet?" bottom text */
      [class*="login"] > p:last-of-type,
      [class*="login__form"] > p,
      form ~ p {
        display: none !important;
      }
    `}</style>
  )
}

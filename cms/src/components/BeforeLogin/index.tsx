'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

export default function BeforeLogin() {
  const params = useSearchParams()
  if (!params.get('created')) return null

  return (
    <div
      style={{
        background: 'rgba(108, 99, 255, 0.15)',
        border: '1px solid #6C63FF',
        borderRadius: '4px',
        padding: '0.75rem 1rem',
        marginBottom: '1.25rem',
        color: '#a09bff',
        fontSize: '0.875rem',
        textAlign: 'center',
      }}
    >
      Account created! You can now log in.
    </div>
  )
}

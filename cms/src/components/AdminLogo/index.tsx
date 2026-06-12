'use client'
import React from 'react'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/satguru-logo.gif"
        alt="Satguru DMC"
        style={{ height: '52px', width: 'auto', maxWidth: '200px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
      />
    </div>
  )
}

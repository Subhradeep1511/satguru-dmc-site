'use client'
import React from 'react'

export function NavHeader() {
  return (
    <div style={{
      padding: '18px 18px 14px',
      borderBottom: '1px solid #E8EAF3',
      marginBottom: 4,
      background: '#FFFFFF',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Blue gradient icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #4570F5 0%, #6B8FF8 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(69,112,245,0.38)',
        }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>

        <div>
          <div style={{
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#1A1D2E',
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
          }}>
            Satguru DMC
          </div>
          <div style={{
            fontSize: '0.6rem',
            color: '#B8BDCF',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: 2,
          }}>
            Russia CMS
          </div>
        </div>

      </div>
    </div>
  )
}

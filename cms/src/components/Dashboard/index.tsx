'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

/* ══ Types ════════════════════════════════════════════════ */
interface Stats {
  blogPosts: number; destinations: number; gallery: number
  testimonials: number; excursions: number; itineraries: number
  bloggers: number; tourPackages: number; exploreListings: number
}
interface RecentItem {
  id: string; title: string; type: string; typeColor: string
  typeBg: string; status: string; href: string; time: string; date: string
}

/* ══ Utilities ════════════════════════════════════════════ */
const relTime = (d: string) => {
  if (!d) return '—'
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 2) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
const fmtDate = (d: string) => {
  if (!d) return '—'
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}
const api = (path: string) => fetch(path).then(r => r.ok ? r.json() : { totalDocs: 0, docs: [] })

/* ══ Chart data seed ══════════════════════════════════════ */
const mkBars = (n: number) => Array.from({ length: 7 }, (_, i) =>
  Math.max(1, Math.round((n || 2) * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.4 + (n || 2)))) / 7) + 1))

/* ══ Color tokens ═════════════════════════════════════════ */
const C = {
  primary:    '#22C55E',
  primaryLt:  'var(--sidebar-link-hover-bg)',
  primaryDk:  '#16A34A',
  bg:         'var(--body-bg)',
  white:      'var(--card-bg)',
  border:     'var(--sidebar-border)',
  borderLt:   'var(--card-border)',
  text:       'var(--text-primary)',
  textMid:    'var(--text-secondary)',
  textLight:  'var(--text-muted)',
  green:      '#22C55E',
  greenLt:    'rgba(34, 197, 94, 0.12)',
  greenText:  '#22C55E',
  red:        '#EF4444',
  redLt:      'rgba(239, 68, 68, 0.12)',
  redText:    '#EF4444',
  orange:     '#F59E0B',
  orangeLt:   'rgba(245, 158, 11, 0.12)',
  orangeText: '#F59E0B',
  teal:       '#14B8A6',
  tealLt:     'rgba(20, 184, 166, 0.12)',
  tealText:   '#14B8A6',
  pink:       '#F472B6',
  pinkLt:     'rgba(244, 114, 182, 0.12)',
  pinkText:   '#F472B6',
  violet:     '#8B5CF6',
  violetLt:   'rgba(139, 92, 246, 0.12)',
  violetText: '#8B5CF6',
}


/* ══════════════════════════════════════════════════════════
   COMPONENT: Stat Card  (matches reference top cards)
══════════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, trendLabel, trendSub, up, iconBg }: {
  icon: React.ReactNode; label: string; value: number | string
  trendLabel: string; trendSub: string; up: boolean; iconBg: string
}) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      flex: 1, minWidth: 0,
      background: C.white,
      borderRadius: 18,
      border: `1px solid ${C.borderLt}`,
      padding: '20px 22px 18px',
      boxShadow: hov ? '0 10px 32px rgba(0,0,0,0.10)' : '0 2px 12px rgba(0,0,0,0.05)',
      transform: hov ? 'translateY(-3px)' : 'none',
      transition: 'all 0.22s ease',
    }}>
      {/* Label + Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: C.textLight, fontWeight: 500 }}>{label}</span>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: iconBg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      {/* Number */}
      <div style={{ fontSize: 34, fontWeight: 800, color: C.text, lineHeight: 1.1, marginBottom: 12 }}>
        {value}
      </div>
      {/* Trend row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
          color: up ? C.greenText : C.redText, fontSize: 12.5, fontWeight: 600 }}>
          {up
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>
          }
          {trendLabel}
        </span>
        <span style={{ fontSize: 12, color: C.textLight }}>{trendSub}</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   COMPONENT: Area Chart with tabs  (reference center chart)
══════════════════════════════════════════════════════════ */
function ContentChart({ stats }: { stats: Stats }) {
  const [tab, setTab] = useState(0)
  const tabs = ['Blog Posts', 'Destinations', 'Excursions']

  const dataMap = [
    mkBars(stats.blogPosts || 6),
    mkBars(stats.destinations || 4),
    mkBars(stats.excursions || 5),
  ]
  const data = dataMap[tab]
  const prev = data.map(v => Math.max(1, Math.round(v * 0.55)))
  const maxV = Math.max(...data, 1)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  // SVG coordinate helpers — viewBox 0 0 560 190
  const cx = (i: number) => 42 + i * (504 / 6)
  const cy = (v: number) => 155 - Math.round((v / maxV) * 125)

  const pts1: [number, number][] = data.map((v, i) => [cx(i), cy(v)])
  const pts2: [number, number][] = prev.map((v, i) => [cx(i), cy(v)])

  const toPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  const line1 = toPath(pts1)
  const line2 = toPath(pts2)
  const area1 = `${line1} L${pts1[6][0].toFixed(1)},165 L${pts1[0][0].toFixed(1)},165 Z`

  const ySteps = [0, Math.round(maxV * 0.33), Math.round(maxV * 0.66), maxV]

  return (
    <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.borderLt}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: '20px 22px' }}>

      {/* Tabs + legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.borderLt}` }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: '6px 16px 10px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', background: 'none', border: 'none',
              borderBottom: `2.5px solid ${tab === i ? C.primary : 'transparent'}`,
              marginBottom: -1,
              color: tab === i ? C.text : C.textLight,
              transition: 'all 0.15s',
            }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.primary }} />
            <span style={{ fontSize: 11.5, color: C.textLight }}>This year</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="22" height="4" viewBox="0 0 22 4">
              <line x1="0" y1="2" x2="22" y2="2" stroke={C.textLight}
                strokeWidth="2" strokeDasharray="4,3" opacity="0.6" />
            </svg>
            <span style={{ fontSize: 11.5, color: C.textLight }}>Last year</span>
          </div>
        </div>
      </div>

      {/* SVG chart */}
      <svg viewBox="0 0 560 190" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.primary} stopOpacity="0.18" />
            <stop offset="100%" stopColor={C.primary} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y-axis grid + labels */}
        {ySteps.map((v, i) => {
          const y = cy(v === 0 ? 0 : v)
          const ly = v === 0 ? 165 : y
          return (
            <g key={i}>
              <line x1="42" y1={ly} x2="546" y2={ly}
                stroke={C.borderLt} strokeWidth="1"
                strokeDasharray={i === 0 ? '0' : '5,4'} />
              <text x="36" y={ly + 4} fontSize="9.5" fill={C.textLight} textAnchor="end">
                {v}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={area1} fill="url(#aG)" />

        {/* Last year dashed */}
        <path d={line2} fill="none" stroke={C.textLight}
          strokeWidth="1.6" strokeDasharray="5,4" opacity="0.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* This year solid */}
        <path d={line1} fill="none" stroke={C.primary}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {pts1.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="white" stroke={C.primary} strokeWidth="2" />
        ))}

        {/* X-axis month labels */}
        {months.map((m, i) => (
          <text key={i} x={cx(i)} y="185" fontSize="10.5" fill={C.textLight} textAnchor="middle">
            {m}
          </text>
        ))}
      </svg>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   COMPONENT: Content by Collection  (reference "Traffic by Website")
══════════════════════════════════════════════════════════ */
function TrafficPanel({ stats }: { stats: Stats }) {
  const rows = [
    { label: 'Blog Posts',    value: stats.blogPosts,    color: C.primary },
    { label: 'Excursions',    value: stats.excursions,   color: C.teal },
    { label: 'Gallery',       value: stats.gallery,      color: C.orange },
    { label: 'Itineraries',   value: stats.itineraries,  color: C.violet },
    { label: 'Testimonials',  value: stats.testimonials, color: C.green },
    { label: 'Destinations',  value: stats.destinations, color: C.pink },
  ]
  const maxV = Math.max(...rows.map(r => r.value), 1)

  return (
    <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.borderLt}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: '20px 22px' }}>
      <h3 style={{ fontSize: 14.5, fontWeight: 700, color: C.text, margin: '0 0 20px' }}>
        Content by Type
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {rows.map((row, i) => {
          const pct = Math.max(12, Math.round((row.value / maxV) * 100))
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, color: C.textMid, fontWeight: 500 }}>
                  {row.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* pill bar — like reference */}
                  <div style={{ height: 5, width: `${pct * 0.7}px`, minWidth: 12, maxWidth: 80,
                    background: row.color, borderRadius: 6, opacity: 0.85 }} />
                  <div style={{ height: 5, width: `${Math.max(8, pct * 0.25)}px`,
                    background: row.color, borderRadius: 6, opacity: 0.35 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   COMPONENT: Collection Card (reference Bitcoin/Ethereum card)
══════════════════════════════════════════════════════════ */
function CollectionCard({ label, count, href, gradient, bars }: {
  label: string; count: number; href: string; gradient: string; bars: number[]
}) {
  const [hov, setHov] = useState(false)
  const max = Math.max(...bars, 1)
  const sPts: [number, number][] = bars.map((v, i) => [
    (i / (bars.length - 1)) * 88,
    42 - (v / max) * 36,
  ])
  const sLine = sPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const sArea = `${sLine} L${sPts[sPts.length - 1][0].toFixed(1)},48 L0,48 Z`

  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: gradient,
        borderRadius: 18,
        padding: '18px 18px 14px',
        marginBottom: 14,
        boxShadow: hov ? '0 12px 36px rgba(0,0,0,0.22)' : '0 4px 18px rgba(0,0,0,0.14)',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'all 0.22s ease',
        overflow: 'hidden',
      }}>

      {/* Collection label */}
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: 10 }}>
        {label}
      </div>

      {/* Count + sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>$</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {count.toLocaleString()}
          </div>
        </div>
        <svg viewBox="0 0 90 48" style={{ width: 90, height: 48 }} preserveAspectRatio="none">
          <path d={sArea} fill="rgba(255,255,255,0.13)" />
          <path d={sLine} fill="none" stroke="rgba(255,255,255,0.88)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        {[
          { label: 'Active',  val: `+${count}`,  color: '#86EFAC' },
          { label: 'Draft',   val: '-0',          color: '#FCA5A5' },
          { label: 'Total',   val: String(count), color: 'rgba(255,255,255,0.75)' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
    </a>
  )
}

/* ══════════════════════════════════════════════════════════
   COMPONENT: New Content card  (reference "New Asset" card)
══════════════════════════════════════════════════════════ */
function NewContentCard({ href }: { href: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 10, padding: '24px 18px',
        background: C.white,
        border: `2px dashed ${hov ? C.primary : C.border}`,
        borderRadius: 18, textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}>
      <div style={{
        width: 46, height: 46, borderRadius: '50%',
        background: hov ? C.primary : C.primaryLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={hov ? '#fff' : C.primary} strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 700,
        color: hov ? C.primary : C.textMid, transition: 'color 0.2s' }}>
        New Content
      </span>
    </a>
  )
}

/* ══════════════════════════════════════════════════════════
   COMPONENT: Table row
══════════════════════════════════════════════════════════ */
function ContentRow({ num, item }: { num: number; item: RecentItem }) {
  const [hov, setHov] = useState(false)
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? 'var(--body-bg)' : 'transparent',
      transition: 'background 0.15s',
      borderBottom: `1px solid ${C.borderLt}`,
    }}>
      <td style={{ padding: '13px 18px', color: C.textLight, fontSize: 13, fontWeight: 500 }}>
        {String(num).padStart(2, '0')}
      </td>
      <td style={{ padding: '13px 18px', color: C.textLight, fontSize: 12.5 }}>
        {item.date}
      </td>
      <td style={{ padding: '13px 18px', color: C.text, fontSize: 13, fontWeight: 500, maxWidth: 220 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </span>
      </td>
      <td style={{ padding: '13px 18px' }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: item.typeColor,
          background: item.typeBg, borderRadius: 20, padding: '3px 12px' }}>
          {item.type}
        </span>
      </td>
      <td style={{ padding: '13px 18px' }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: C.greenText,
          background: C.greenLt, borderRadius: 20, padding: '3px 12px',
          display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.greenText, flexShrink: 0 }} />
          {item.status}
        </span>
      </td>
      <td style={{ padding: '13px 18px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={item.href} style={{ fontSize: 12.5, fontWeight: 600, color: C.primary }}>View</a>
          <span style={{ color: C.border }}>·</span>
          <a href={item.href} style={{ fontSize: 12.5, fontWeight: 600, color: C.primary }}>Edit</a>
        </div>
      </td>
    </tr>
  )
}

/* ══════════════════════════════════════════════════════════
   COMPONENT: Recent Content Table  (reference "Stock Details")
══════════════════════════════════════════════════════════ */
function RecentTable({ recent }: { recent: RecentItem[] }) {
  const ITEMS_PER_PAGE = 6
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = recent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const curPage = Math.min(page, totalPages)
  const pageStart = (curPage - 1) * ITEMS_PER_PAGE
  const paged = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE)

  const goTo = (n: number) => setPage(Math.max(1, Math.min(n, totalPages)))

  const maxBtns = 5
  let startBtn = Math.max(1, curPage - Math.floor(maxBtns / 2))
  const endBtn = Math.min(totalPages, startBtn + maxBtns - 1)
  if (endBtn - startBtn < maxBtns - 1) startBtn = Math.max(1, endBtn - maxBtns + 1)
  const pageNums = Array.from({ length: endBtn - startBtn + 1 }, (_, i) => startBtn + i)

  return (
    <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.borderLt}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

      {/* Header bar */}
      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.borderLt}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: C.text, margin: 0 }}>
          Recent Content
        </h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 24, padding: '7px 14px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={C.textLight} strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="sg-search-bare"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
              placeholder="Search content…"
              style={{
                background: 'none', border: 'none', outline: 'none',
                fontSize: 12.5, color: C.text, width: 140,
              }}
            />
          </div>
          <a href="/admin/collections/blog-posts/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            background: C.primary, color: '#fff',
            fontSize: 12.5, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add
          </a>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--body-bg)' }}>
              {['#', 'Date', 'Title', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '11px 18px', textAlign: 'left',
                  fontSize: 11, fontWeight: 700, color: C.textLight,
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  borderBottom: `1px solid ${C.borderLt}`,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '44px 22px', textAlign: 'center',
                  color: C.textLight, fontSize: 13 }}>
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : 'No content yet — start adding items using the CMS collections.'}
                </td>
              </tr>
            ) : paged.map((item, i) => (
              <ContentRow key={item.id} num={pageStart + i + 1} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div style={{ padding: '12px 22px', borderTop: `1px solid ${C.borderLt}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: C.textLight }}>
          {filtered.length === 0
            ? 'No items'
            : `Showing ${pageStart + 1}–${Math.min(pageStart + ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} items`}
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            onClick={() => goTo(curPage - 1)}
            disabled={curPage === 1}
            style={{ width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${C.border}`, background: C.white,
              color: C.textMid, fontSize: 14, cursor: curPage === 1 ? 'default' : 'pointer',
              opacity: curPage === 1 ? 0.4 : 1 }}>‹</button>
          {pageNums.map(n => (
            <button key={n} onClick={() => goTo(n)} style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${n === curPage ? C.primary : C.border}`,
              background: n === curPage ? C.primary : C.white,
              color: n === curPage ? '#fff' : C.textMid,
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              boxShadow: n === curPage ? '0 3px 10px rgba(34,197,94,0.3)' : 'none',
            }}>{n}</button>
          ))}
          <button
            onClick={() => goTo(curPage + 1)}
            disabled={curPage === totalPages}
            style={{ width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${C.border}`, background: C.white,
              color: C.textMid, fontSize: 14, cursor: curPage === totalPages ? 'default' : 'pointer',
              opacity: curPage === totalPages ? 0.4 : 1 }}>›</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════ */
export default function DashboardView() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0, destinations: 0, gallery: 0, testimonials: 0,
    excursions: 0, itineraries: 0, bloggers: 0, tourPackages: 0, exploreListings: 0,
  })
  const [recent, setRecent] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [blogs, dests, gallery, testi, exc, itins, bloggers, tourPkgs, exploreL,
        rBlogs, rDests, rGallery] = await Promise.all([
        api('/api/blog-posts?limit=0'),
        api('/api/destinations?limit=0'),
        api('/api/gallery-items?limit=0'),
        api('/api/testimonials?limit=0'),
        api('/api/excursions?limit=0'),
        api('/api/itineraries?limit=0'),
        api('/api/bloggers?limit=0'),
        api('/api/tour-packages?limit=0'),
        api('/api/explore-listings?limit=0'),
        api('/api/blog-posts?limit=20&sort=-createdAt'),
        api('/api/destinations?limit=10&sort=-createdAt'),
        api('/api/gallery-items?limit=10&sort=-createdAt'),
      ])

      setStats({
        blogPosts:      blogs.totalDocs      || 0,
        destinations:   dests.totalDocs      || 0,
        gallery:        gallery.totalDocs    || 0,
        testimonials:   testi.totalDocs      || 0,
        excursions:     exc.totalDocs        || 0,
        itineraries:    itins.totalDocs      || 0,
        bloggers:       bloggers.totalDocs   || 0,
        tourPackages:   tourPkgs.totalDocs   || 0,
        exploreListings: exploreL.totalDocs  || 0,
      })

      const rows: RecentItem[] = [
        ...(rDests.docs || []).map((d: any) => ({
          id: d.id, title: d.title || 'Destination',
          type: 'Destination', typeColor: '#2563EB', typeBg: '#DBEAFE',
          status: 'Active',
          href: `/admin/collections/destinations/${d.id}`,
          time: relTime(d.createdAt), date: fmtDate(d.createdAt),
        })),
        ...(rBlogs.docs || []).map((d: any) => ({
          id: d.id, title: d.title || 'Blog Post',
          type: 'Blog Post', typeColor: C.primary, typeBg: C.primaryLt,
          status: 'Published',
          href: `/admin/collections/blog-posts/${d.id}`,
          time: relTime(d.createdAt), date: fmtDate(d.createdAt),
        })),
        ...(rGallery.docs || []).map((d: any) => ({
          id: d.id, title: d.title || 'Gallery Item',
          type: 'Gallery', typeColor: C.orangeText, typeBg: C.orangeLt,
          status: 'Active',
          href: `/admin/collections/gallery-items/${d.id}`,
          time: relTime(d.createdAt), date: fmtDate(d.createdAt),
        })),
      ]

      setRecent(rows)
    } catch (e) {
      console.error('[Dashboard]', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const userName = (user as any)?.name || (user as any)?.email?.split('@')[0] || 'Admin'

  /* Loading spinner */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: `3px solid ${C.primary}`,
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'sgSpin 0.9s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: C.textLight, fontSize: 13, margin: 0 }}>Loading dashboard…</p>
      </div>
      <style>{`@keyframes sgSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      padding: '28px 30px 40px',
      background: C.bg,
      fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif",
    }}>

      {/* ══ PAGE HEADER ════════════════════════════════════ */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, lineHeight: 1.2 }}>
            Welcome Back,{' '}
            <span style={{ color: C.primary }}>{userName}!</span>
          </h1>
          <p style={{ fontSize: 13, color: C.textLight, margin: '5px 0 0' }}>
            Satguru DMC Russia — Content Management
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            background: C.white, border: `1px solid ${C.border}`,
            borderRadius: 24, padding: '9px 18px', minWidth: 220,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={C.textLight} strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span style={{ fontSize: 13, color: C.textLight }}>Search…</span>
          </div>
          {/* Add Content button */}
          <a href="/admin/collections/blog-posts/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', borderRadius: 12,
            background: C.primary, color: '#fff',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(34,197,94,0.30)',
            transition: 'all 0.18s',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Content
          </a>
        </div>
      </div>

      {/* ══ 4 STAT CARDS ═══════════════════════════════════ */}
      <div style={{ display: 'flex', gap: 18, marginBottom: 22, flexWrap: 'wrap' }}>

        <StatCard
          label="Total Destinations"
          value={stats.destinations}
          trendLabel={stats.destinations > 0 ? 'Active' : 'Empty'}
          trendSub="In your CMS"
          up={stats.destinations > 0}
          iconBg="rgba(37, 99, 235, 0.15)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
        />

        <StatCard
          label="Total Itineraries"
          value={stats.itineraries}
          trendLabel={stats.itineraries > 0 ? 'Active' : 'Empty'}
          trendSub="Tour packages"
          up={stats.itineraries > 0}
          iconBg="rgba(217, 119, 6, 0.15)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />

        <StatCard
          label="Total Blog Posts"
          value={stats.blogPosts}
          trendLabel={stats.blogPosts > 0 ? 'Published' : 'Empty'}
          trendSub="Content articles"
          up={stats.blogPosts > 0}
          iconBg="rgba(34, 197, 94, 0.15)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />

        <StatCard
          label="Total Excursions"
          value={stats.excursions}
          trendLabel={stats.excursions > 0 ? 'Active' : 'Empty'}
          trendSub="Activity pages"
          up={stats.excursions > 0}
          iconBg="rgba(244, 114, 182, 0.15)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

      </div>

      {/* ══ MAIN GRID: content left + collections right ════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 18, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Chart + Traffic row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
            <ContentChart stats={stats} />
            <TrafficPanel stats={stats} />
          </div>

          {/* Recent content table */}
          <RecentTable recent={recent} />

        </div>

        {/* RIGHT PANEL — Collections */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 15.5, fontWeight: 700, color: C.text }}>Collections</span>
            <a href="/admin/collections/explore-listings"
              style={{ fontSize: 12.5, color: C.primary, fontWeight: 600,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              More Collections
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <CollectionCard
            label="Explore Listings"
            count={stats.exploreListings}
            href="/admin/collections/explore-listings"
            gradient="linear-gradient(145deg, #1E3A8A 0%, #1D4ED8 55%, #3B82F6 100%)"
            bars={mkBars(stats.exploreListings || 5)}
          />

          <CollectionCard
            label="Gallery Items"
            count={stats.gallery}
            href="/admin/collections/gallery-items"
            gradient="linear-gradient(145deg, #312E81 0%, #4C1D95 50%, #7C3AED 100%)"
            bars={mkBars(stats.gallery || 4)}
          />

          <NewContentCard href="/admin/collections/explore-listings/create" />
        </div>

      </div>

      <style>{`@keyframes sgSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

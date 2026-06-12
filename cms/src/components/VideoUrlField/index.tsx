'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useField } from '@payloadcms/ui'

interface MediaVideo {
  id: string
  filename: string
  url: string
  mimeType: string
}

const btnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '8px 12px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  background: active ? '#16a34a' : '#2d2d2d',
  color: active ? '#fff' : '#9ca3af',
  transition: 'all 0.15s ease',
})

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #3d3d3d',
  background: '#1a1a1a',
  color: '#e5e7eb',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const VideoUrlField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })

  const isMediaUrl = (v?: string) =>
    !!v && (v.includes('/api/media/') || !!v.match(/\.(mp4|webm|mov|avi|mkv)/i))

  const [mode, setMode] = useState<'link' | 'media'>(
    isMediaUrl(value) ? 'media' : 'link',
  )
  const [videos, setVideos]       = useState<MediaVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchVideos = async () => {
    setLoadingVideos(true)
    try {
      const r    = await fetch('/api/media?where[mimeType][contains]=video&limit=100&sort=-createdAt')
      const data = await r.json()
      if (data?.docs) setVideos(data.docs)
    } catch (_) {}
    setLoadingVideos(false)
  }

  const handleModeSwitch = (m: 'link' | 'media') => {
    setMode(m)
    if (m === 'media' && videos.length === 0) fetchVideos()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadMsg('Uploading…')

    const form = new FormData()
    form.append('file', file)
    form.append('alt',  file.name)

    try {
      const r    = await fetch('/api/media', { method: 'POST', body: form })
      const data = await r.json()
      if (data?.doc?.url) {
        const url = `http://localhost:3002${data.doc.url}`
        setValue(url)
        setVideos((prev) => [data.doc, ...prev])
        setUploadMsg(`✓ "${file.name}" uploaded & selected`)
      } else {
        setUploadMsg('Upload failed — try again')
      }
    } catch (_) {
      setUploadMsg('Upload error — try again')
    }
    setUploading(false)
    // Reset file input so same file can be re-uploaded if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      {/* Label */}
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>
        Video URL
      </label>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="button" style={btnStyle(mode === 'link')}  onClick={() => handleModeSwitch('link')}>
          🔗 Paste Link
        </button>
        <button type="button" style={btnStyle(mode === 'media')} onClick={() => handleModeSwitch('media')}>
          📁 Select / Upload Video
        </button>
      </div>

      {/* ── LINK MODE ── */}
      {mode === 'link' && (
        <>
          <input
            type="url"
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
            Paste a YouTube link <em>(youtube.com/watch?v=…)</em> or a direct .mp4 URL.
          </p>
        </>
      )}

      {/* ── MEDIA MODE ── */}
      {mode === 'media' && (
        <>
          {/* Upload from folder */}
          <div
            style={{
              border: '2px dashed #3d3d3d',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: '#111',
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#e5e7eb' }}>Upload from your computer</p>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>mp4, webm, mov — max 10MB</p>
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: uploading ? '#374151' : '#16a34a',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                cursor: uploading ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {uploading ? 'Uploading…' : '⬆ Upload Video'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {uploadMsg && (
            <p style={{ margin: 0, fontSize: 12, color: uploadMsg.startsWith('✓') ? '#4ade80' : '#f87171' }}>
              {uploadMsg}
            </p>
          )}

          {/* Or select existing */}
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>— or select an already-uploaded video —</p>
          <select
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
            disabled={loadingVideos}
          >
            <option value="">
              {loadingVideos ? 'Loading…' : videos.length ? 'Select a video…' : 'No videos uploaded yet'}
            </option>
            {videos.map((v) => (
              <option key={v.id} value={`http://localhost:3002${v.url}`}>
                {v.filename}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Current value preview */}
      {value && (
        <p style={{ fontSize: 12, color: '#4ade80', margin: 0, wordBreak: 'break-all' }}>
          ✓ {value}
        </p>
      )}
    </div>
  )
}

export { VideoUrlField }
export default VideoUrlField

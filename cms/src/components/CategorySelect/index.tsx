'use client'
import React, { useEffect, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

interface Category {
  id: string
  name: string
  slug: string
}

const CategorySelectField: React.FC<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog-categories?where[active][equals]=true&sort=order&limit=50')
      .then((r) => r.json())
      .then((data) => {
        if (data?.docs) setOptions(data.docs)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#6b7280',
        }}
      >
        Category <span style={{ color: '#ef4444' }}>*</span>
      </label>

      <select
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        required
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: loading ? '#f3f4f6' : '#fafafa',
          fontSize: 14,
          color: value ? '#111' : '#9ca3af',
          cursor: loading ? 'wait' : 'pointer',
          outline: 'none',
          appearance: 'auto',
        }}
      >
        <option value="" disabled>
          {loading ? 'Loading categories…' : 'Select a category'}
        </option>
        {options.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
        Post will appear under this tab on the Media page.
      </p>
    </div>
  )
}

export { CategorySelectField }
export default CategorySelectField

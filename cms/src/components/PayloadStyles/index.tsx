'use client'
// ssr:false must be called inside a Client Component (not a Server Component).
// CssLoader holds the actual @payloadcms/next/css import so it is never
// evaluated during SSR — this prevents data-merge-styles="true" being added
// to the style tag, which would mismatch the @layer content on the client.
import dynamic from 'next/dynamic'

const CssLoader = dynamic(() => import('./CssLoader'), { ssr: false })

export default function PayloadStyles() {
  return <CssLoader />
}

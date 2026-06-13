import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@libsql/client',
    '@libsql/linux-x64-gnu',
    '@libsql/darwin-x64',
    '@libsql/darwin-arm64',
    'better-sqlite3',
    'sharp',
  ],
  experimental: {
    // Revert to Next.js 14-style CSS chunking — prevents Next.js 15's
    // `data-merge-styles="true"` RSC style-merging mechanism from adding
    // a server attribute that React can't reconcile with Payload's @layer
    // CSS content during client hydration (the recurring hydration error).
    cssChunking: false,
  },
  // Redirect root to admin
  async redirects() {
    return [{ source: '/', destination: '/admin', permanent: false }]
  },
  // Disable caching on all API routes so dashboard edits appear instantly
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
          { key: 'Pragma',        value: 'no-cache' },
          { key: 'Expires',       value: '0' },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Ensure seed.db and Linux sharp binaries are bundled into serverless output
  outputFileTracingIncludes: {
    '/admin/[[...segments]]': [
      './seed.db',
      './node_modules/@img/sharp-linux-x64/**/*',
      './node_modules/@img/sharp-libvips-linux-x64/**/*',
    ],
    '/api/[...slug]': [
      './seed.db',
      './node_modules/@img/sharp-linux-x64/**/*',
      './node_modules/@img/sharp-libvips-linux-x64/**/*',
    ],
  },
}

export default withPayload(nextConfig)

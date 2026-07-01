import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/uufznuiclxuevcpznwll\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
      manifest: {
        name: 'Campamento Bahá\'í Madrid',
        short_name: 'Campamento',
        theme_color: '#7c3aed',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'https://api.dicebear.com/7.x/shapes/svg?seed=camp&size=192', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'https://api.dicebear.com/7.x/shapes/svg?seed=camp&size=512', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
})

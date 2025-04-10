import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// 动态获取基础路径
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/MyTools/' : '/'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: '油耗計算',
        short_name: '油耗計算',
        description: '車輛油耗計算應用程式',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: BASE_PATH,
        scope: BASE_PATH,
        includeManifest: true,
        manifestFilename: 'manifest.json', // Force JSON filename
        useCredentials: false,
        appleMobileWebAppCapable: 'yes',
        injectRegister: 'auto',
        strategies: 'generateSW',
        icons: [
          {
            src: `${BASE_PATH}img/icons/android-chrome-192x192.png`,
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: `${BASE_PATH}img/icons/android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: `${BASE_PATH}img/icons/android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globDirectory: 'dist',
        navigateFallback: `${BASE_PATH}index.html`,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.tomtom\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tomtom-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30天
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/vipmbr\.cpc\.com\.tw/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cpc-oil-data',
              expiration: {
                maxAgeSeconds: 24 * 60 * 60 // 1天
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false,
        navigateFallbackAllowlist: [/^\/Mytools/]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://vipmbr.cpc.com.tw',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      '@tomtom-international/web-sdk-maps',
      '@tomtom-international/web-sdk-services'
    ]
  },
  base: BASE_PATH,
  build: {
    minify:false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
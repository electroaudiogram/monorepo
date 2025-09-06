import node from '@astrojs/node'
import react from '@astrojs/react'
import loadEnv from '@electroaudiogram/load-env'
import playformCompress from '@playform/compress'
import tailwindcss from '@tailwindcss/vite'
import compressor from 'astro-compressor'
import { defineConfig } from 'astro/config'

loadEnv('../../../.env')

export default defineConfig({
  trailingSlash: 'never',
  site: process.env.WEBSITE_URL,
  devToolbar: { enabled: false },
  output: 'server',
  adapter: node({
    mode: 'middleware',
  }),
  integrations: [react(), playformCompress({}), compressor()],
  vite: {
    plugins: [
      // @ts-expect-error problem with vite types
      tailwindcss(),
    ],
  },
  server: {
    port: Number(process.env.WEBSITE_PORT) || 4321,
  },
  experimental: {
    fonts: [
      {
        provider: 'local',
        name: 'n',
        cssVariable: '--font-n',
        fallbacks: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        variants: [
          // {
          //   weight: 100,
          //   style: 'normal',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-thin-webfont.woff2'],
          // },
          // {
          //   weight: 100,
          //   style: 'italic',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-thinitalic-webfont.woff2'],
          // },
          // {
          //   weight: 200,
          //   style: 'normal',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-ultralight-webfont.woff2'],
          // },
          // {
          //   weight: 200,
          //   style: 'italic',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: [
          //     '@electroaudiogram/fonts/nudica-ultralightitalic-webfont.woff2',
          //   ],
          // },
          // {
          //   weight: 300,
          //   style: 'normal',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-light-webfont.woff2'],
          // },
          // {
          //   weight: 300,
          //   style: 'italic',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-lightitalic-webfont.woff2'],
          // },
          {
            weight: 400,
            style: 'normal',
            display: 'swap',
            unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
            src: ['@electroaudiogram/fonts/nudica-regular-webfont.woff2'],
          },
          // {
          //   weight: 400,
          //   style: 'italic',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-regularitalic-webfont.woff2'],
          // },
          {
            weight: 500,
            style: 'normal',
            display: 'swap',
            unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
            src: ['@electroaudiogram/fonts/nudica-medium-webfont.woff2'],
          },
          // {
          //   weight: 500,
          //   style: 'italic',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-mediumitalic-webfont.woff2'],
          // },
          // {
          //   weight: 700,
          //   style: 'normal',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-bold-webfont.woff2'],
          // },
          // {
          //   weight: 700,
          //   style: 'italic',
          //   display: 'swap',
          //   unicodeRange: ['U+0000-00FF', 'U+0100-024F'],
          //   src: ['@electroaudiogram/fonts/nudica-bolditalic-webfont.woff2'],
          // },
        ],
      },
    ],
  },
})

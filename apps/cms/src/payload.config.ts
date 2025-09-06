import loadEnv from '@electroaudiogram/load-env'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

loadEnv('../../../.env')

export default buildConfig({
  telemetry: false,
  serverURL: process.env.CMS_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
    },
    meta: {
      robots: 'noindex, nofollow',
    },
  },
  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
  },
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { en, fr },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.CMS_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/api/api.d.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: `postgres://${process.env.CMS_DATABASE_USER}:${process.env.CMS_DATABASE_PASSWORD}@${process.env.CMS_DATABASE_HOST}:${process.env.CMS_DATABASE_PORT}/${process.env.CMS_DATABASE_NAME}`,
    },
  }),
  sharp,
  plugins: [],
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seeds/index.ts'),
      key: 'seed',
    },
  ],
})

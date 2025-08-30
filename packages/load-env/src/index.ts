import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

export default function loadEnv(envPath: string) {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)

  const rootEnv = path.resolve(dirname, envPath)

  if (fs.existsSync(rootEnv)) {
    dotenvExpand.expand(dotenv.config({ path: rootEnv }))
    console.log(`[env] loaded .env from ${rootEnv}`)
  } else {
    console.log(
      '[env] no .env file found, relying on process.env (Docker/CI/CD)',
    )
  }
}

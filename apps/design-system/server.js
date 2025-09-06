// @ts-check
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static(path.join(dirname, 'storybook-static')))

app.get('/{*any}', (_, res) => {
  res.sendFile(path.join(dirname, 'storybook-static', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Storybook server running on http://0.0.0.0:${PORT}`)
})

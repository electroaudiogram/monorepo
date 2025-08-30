import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.test.ts'],
    },
    globals: true,
  },
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as retryUtils from './retry'

// ----------------------
// Mock sleep
// ----------------------
beforeEach(() => {
  vi.restoreAllMocks()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.fetch = undefined as any
  vi.spyOn(retryUtils, 'sleep').mockImplementation(() => Promise.resolve())
})

// ----------------------
// fetchWithRetry tests
// ----------------------
import { fetchWithRetry } from './fetch'

describe('fetchWithRetry', () => {
  const baseUrl = 'http://api.test'
  const config = { baseUrl, retries: 2, timeout: 1000, headers: {} }

  it('returns JSON response correctly', async () => {
    const fakeData = { id: 1 }
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: { get: () => 'application/json' },
      json: async () => fakeData,
    })

    const result = await fetchWithRetry(config, '/resource')
    expect(result.data).toEqual(fakeData)
  })

  it('returns text response correctly', async () => {
    const text = 'Hello'
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: { get: () => 'text/plain' },
      text: async () => text,
    })

    const result = await fetchWithRetry(config, '/text')
    expect(result.data).toBe(text)
  })

  // it('throws ApiError on non-ok response', async () => {
  //   global.fetch = vi.fn().mockResolvedValueOnce({
  //     ok: false,
  //     status: 500,
  //     statusText: 'Internal Server Error',
  //     headers: { get: () => 'application/json' },
  //     json: async () => ({}),
  //   })

  //   await expect(fetchWithRetry(config, '/fail')).rejects.toMatchObject({
  //     name: 'ApiError',
  //     status: 500,
  //   })
  // })
})

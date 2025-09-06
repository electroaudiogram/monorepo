import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApiError } from '../types'

import { calculateDelay, defaultRetryCondition, sleep } from './retry'

describe('defaultRetryCondition', () => {
  const makeError = (overrides: Partial<ApiError>): ApiError => ({
    name: 'Error',
    message: 'test',
    ...overrides,
  })

  it('retries on NetworkError', () => {
    const error = makeError({ name: 'NetworkError' })
    expect(defaultRetryCondition(error)).toBe(true)
  })

  it('retries on TimeoutError', () => {
    const error = makeError({ name: 'TimeoutError' })
    expect(defaultRetryCondition(error)).toBe(true)
  })

  it('retries on 5xx errors', () => {
    const error = makeError({ status: 503 })
    expect(defaultRetryCondition(error)).toBe(true)
  })

  it('retries on 429 (Too Many Requests)', () => {
    const error = makeError({ status: 429 })
    expect(defaultRetryCondition(error)).toBe(true)
  })

  it('retries on 408 (Request Timeout)', () => {
    const error = makeError({ status: 408 })
    expect(defaultRetryCondition(error)).toBe(true)
  })

  it('does not retry on 400 (Bad Request)', () => {
    const error = makeError({ status: 400 })
    expect(defaultRetryCondition(error)).toBe(false)
  })

  it('does not retry on generic error without status', () => {
    const error = makeError({})
    expect(defaultRetryCondition(error)).toBe(false)
  })
})

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('resolves after given milliseconds', async () => {
    const promise = sleep(1000)
    vi.advanceTimersByTime(999)
    let settled = false
    promise.then(() => (settled = true))
    expect(settled).toBe(false)

    vi.advanceTimersByTime(1)
    await promise
    expect(settled).toBe(true)
  })
})

describe('calculateDelay', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // deterministic jitter
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('applies exponential backoff with jitter', () => {
    // attempt = 1 → baseDelay * 1
    const d1 = calculateDelay(1, 100)
    expect(d1).toBeGreaterThanOrEqual(100)
    expect(d1).toBeLessThanOrEqual(100 * 1.1)

    // attempt = 2 → baseDelay * 2
    const d2 = calculateDelay(2, 100)
    expect(d2).toBeGreaterThanOrEqual(200)
    expect(d2).toBeLessThanOrEqual(200 * 1.1)
  })

  it('caps the delay at 30 seconds', () => {
    const result = calculateDelay(20, 1000) // this would normally exceed 30s
    expect(result).toBeLessThanOrEqual(30000)
  })
})

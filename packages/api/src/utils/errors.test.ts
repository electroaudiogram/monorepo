import { describe, expect, it } from 'vitest'

import {
  createApiError,
  createNetworkError,
  createTimeoutError,
} from './errors'

describe('createApiError', () => {
  it('creates a basic ApiError with message only', () => {
    const err = createApiError('Something went wrong')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('ApiError')
    expect(err.message).toBe('Something went wrong')
    expect(err.status).toBeUndefined()
    expect(err.statusText).toBeUndefined()
    expect(err.url).toBeUndefined()
    expect(err.attempt).toBeUndefined()
  })

  it('creates an ApiError with all fields', () => {
    const err = createApiError(
      'Not Found',
      404,
      'Not Found',
      'http://example.com',
      2,
    )

    expect(err.name).toBe('ApiError')
    expect(err.status).toBe(404)
    expect(err.statusText).toBe('Not Found')
    expect(err.url).toBe('http://example.com')
    expect(err.attempt).toBe(2)
  })
})

describe('createNetworkError', () => {
  it('creates a NetworkError with correct name', () => {
    const err = createNetworkError('Network is down', 'http://api.com', 1)

    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('NetworkError')
    expect(err.message).toBe('Network is down')
    expect(err.url).toBe('http://api.com')
    expect(err.attempt).toBe(1)
    expect(err.status).toBeUndefined()
    expect(err.statusText).toBeUndefined()
  })
})

describe('createTimeoutError', () => {
  it('creates a TimeoutError with correct name', () => {
    const err = createTimeoutError('Request timed out', 'http://api.com', 3)

    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('TimeoutError')
    expect(err.message).toBe('Request timed out')
    expect(err.url).toBe('http://api.com')
    expect(err.attempt).toBe(3)
    expect(err.status).toBeUndefined()
    expect(err.statusText).toBeUndefined()
  })
})

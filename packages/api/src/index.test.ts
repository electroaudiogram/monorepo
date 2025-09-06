import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createAPI } from './'
import * as fetchUtils from './utils/fetch'

// Mock createHttpMethods so we control the behavior of http.get/post/put/delete
vi.mock('./utils/fetch', async () => {
  return {
    ...((await vi.importActual('./utils/fetch')) as object),
    createHttpMethods: vi.fn(),
  }
})

describe('createAPI', () => {
  let mockHttp: Record<
    'get' | 'post' | 'put' | 'delete',
    ReturnType<typeof vi.fn>
  >

  beforeEach(() => {
    vi.clearAllMocks()

    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
    ;(
      fetchUtils.createHttpMethods as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(mockHttp)
  })

  it('initializes with baseUrl and optional apiKey', () => {
    const api = createAPI('http://localhost', 'secret')

    expect(api.getConfig()).toMatchObject({
      baseUrl: 'http://localhost',
      headers: { Authorization: 'Bearer secret' },
      retries: 3,
      timeout: 15000,
    })
  })

  it('calls getCollection and returns docs', async () => {
    const api = createAPI('http://localhost')
    mockHttp.get!.mockResolvedValueOnce({ data: { docs: [{ id: 1 }] } })

    const result = await api.getCollection('media')

    expect(mockHttp.get).toHaveBeenCalledWith('/api/media', {}, undefined)
    expect(result).toEqual([{ id: 1 }])
  })

  it('calls getDocument and returns data', async () => {
    const api = createAPI('http://localhost')
    mockHttp.get.mockResolvedValueOnce({ data: { id: 123, title: 'Doc' } })

    const result = await api.getDocument('media', 123)

    expect(mockHttp.get).toHaveBeenCalledWith('/api/media/123', {}, undefined)
    expect(result).toEqual({ id: 123, title: 'Doc' })
  })

  it('calls createDocument and returns data', async () => {
    const api = createAPI('http://localhost')
    mockHttp.post.mockResolvedValueOnce({ data: { id: 5, title: 'New' } })

    const result = await api.createDocument('media', { title: 'New' })

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/media',
      { title: 'New' },
      {},
      undefined,
    )
    expect(result).toEqual({ id: 5, title: 'New' })
  })

  it('calls updateDocument and returns data', async () => {
    const api = createAPI('http://localhost')
    mockHttp.put.mockResolvedValueOnce({ data: { id: 10, title: 'Updated' } })

    const result = await api.updateDocument('media', 10, {
      title: 'Updated',
    })

    expect(mockHttp.put).toHaveBeenCalledWith(
      '/api/media/10',
      { title: 'Updated' },
      {},
      undefined,
    )
    expect(result).toEqual({ id: 10, title: 'Updated' })
  })

  it('calls deleteDocument', async () => {
    const api = createAPI('http://localhost')
    mockHttp.delete.mockResolvedValueOnce({})

    await api.deleteDocument('media', 99)

    expect(mockHttp.delete).toHaveBeenCalledWith('/api/media/99', {}, undefined)
  })

  it('calls find with query params', async () => {
    const api = createAPI('http://localhost')
    mockHttp.get.mockResolvedValueOnce({
      data: {
        docs: [{ id: 1 }],
        totalDocs: 1,
        limit: 10,
        page: 1,
        totalPages: 1,
      },
    })

    const result = await api.find('media', {
      where: { title: { equals: 'test' } },
    })

    expect(mockHttp.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/media?'),
      {},
      undefined,
    )
    expect(result.docs).toEqual([{ id: 1 }])
  })

  it('updates configuration via updateConfig', () => {
    const api = createAPI('http://localhost')
    api.updateConfig({ retries: 10, timeout: 5000 })

    expect(api.getConfig()).toMatchObject({
      retries: 10,
      timeout: 5000,
    })
  })
})

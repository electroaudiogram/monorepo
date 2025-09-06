import * as qs from 'qs-esm'

import type * as Payload from '../api'
import type {
  ApiConfig,
  ApiError,
  ApiResponse,
  PayloadQuery,
  RetryConfig,
} from './types'

import {
  createApiError,
  createNetworkError,
  createTimeoutError,
} from './utils/errors'
import { createHttpMethods, fetchWithRetry } from './utils/fetch'
import { calculateDelay, defaultRetryCondition, sleep } from './utils/retry'

const createAPI = (baseUrl: string, apiKey?: string) => {
  const config: ApiConfig = {
    baseUrl,
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    retries: 3,
    timeout: 15000,
  }

  const http = createHttpMethods(config)

  // Fonction utilitaire pour construire les query strings Payload
  const buildQueryString = (query?: PayloadQuery): string => {
    if (!query || Object.keys(query).length === 0) return ''

    return (
      '?' +
      qs.stringify(query, {
        encode: false,
        addQueryPrefix: false,
        arrayFormat: 'brackets',
      })
    )
  }

  return {
    // Méthodes HTTP de base
    ...http,
    // Méthodes spécifiques à PayloadCMS
    getCollection: async <T = unknown>(
      collection: keyof Payload.Config['collections'],
      query?: PayloadQuery,
      retryConfig?: Partial<RetryConfig>,
    ): Promise<T[]> => {
      const queryString = buildQueryString(query)
      const response = await http.get<{ docs: T[] }>(
        `/api/${collection}${queryString}`,
        {},
        retryConfig,
      )
      return response.data.docs
    },

    getDocument: async <T = unknown>(
      collection: keyof Payload.Config['collections'],
      id: number,
      query?: Pick<PayloadQuery, 'depth' | 'locale' | 'fallbackLocale'>,
      retryConfig?: Partial<RetryConfig>,
    ): Promise<T> => {
      const queryString = buildQueryString(query)
      const response = await http.get<T>(
        `/api/${collection}/${id}${queryString}`,
        {},
        retryConfig,
      )
      return response.data
    },

    createDocument: async <T = unknown>(
      collection: keyof Payload.Config['collections'],
      data: Partial<T>,
      retryConfig?: Partial<RetryConfig>,
    ): Promise<T> => {
      const response = await http.post<T>(
        `/api/${collection}`,
        data,
        {},
        retryConfig,
      )
      return response.data
    },

    updateDocument: async <T = unknown>(
      collection: keyof Payload.Config['collections'],
      id: number,
      data: Partial<T>,
      retryConfig?: Partial<RetryConfig>,
    ): Promise<T> => {
      const response = await http.put<T>(
        `/api/${collection}/${id}`,
        data,
        {},
        retryConfig,
      )
      return response.data
    },

    deleteDocument: async (
      collection: keyof Payload.Config['collections'],
      id: number,
      retryConfig?: Partial<RetryConfig>,
    ): Promise<void> => {
      await http.delete(`/api/${collection}/${id}`, {}, retryConfig)
    },

    // Recherche avec query complexe
    find: async <T = unknown>(
      collection: keyof Payload.Config['collections'],
      query: PayloadQuery,
      retryConfig?: Partial<RetryConfig>,
    ): Promise<{
      docs: T[]
      totalDocs: number
      limit: number
      page: number
      totalPages: number
    }> => {
      const queryString = buildQueryString(query)
      const response = await http.get<{
        docs: T[]
        totalDocs: number
        limit: number
        page: number
        totalPages: number
      }>(`/api/${collection}${queryString}`, {}, retryConfig)
      return response.data
    },

    // Méthode pour mettre à jour la configuration
    updateConfig: (newConfig: Partial<ApiConfig>): void => {
      Object.assign(config, newConfig)
    },

    // Accès direct à la configuration
    getConfig: () => ({ ...config }),
  }
}

export {
  calculateDelay,
  createAPI,
  createApiError,
  createHttpMethods,
  createNetworkError,
  createTimeoutError,
  defaultRetryCondition,
  fetchWithRetry,
  sleep,
}

export type {
  ApiConfig,
  ApiError,
  ApiResponse,
  Payload,
  PayloadQuery,
  RetryConfig,
}

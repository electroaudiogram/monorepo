import type { ApiConfig, ApiError, ApiResponse, RetryConfig } from '../types'

import {
  createApiError,
  createNetworkError,
  createTimeoutError,
} from './errors'
import { calculateDelay, defaultRetryCondition, sleep } from './retry'

const executeRequest = async <T>(
  url: string,
  options: RequestInit,
  attempt: number,
  timeout: number,
): Promise<ApiResponse<T>> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw createApiError(
        `HTTP Error: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText,
        url,
        attempt,
      )
    }

    let data: T
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else if (contentType?.includes('text/')) {
      data = (await response.text()) as T
    } else {
      data = (await response.blob()) as T
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof TypeError && error.name === 'AbortError') {
      throw createTimeoutError(
        `Request timeout after ${timeout}ms`,
        url,
        attempt,
      )
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw createNetworkError(`Network error: ${error.message}`, url, attempt)
    }

    if (error && typeof error === 'object' && 'status' in error) {
      throw error
    }

    throw createApiError(
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      undefined,
      url,
      attempt,
    )
  }
}
// Fonction principale de fetch avec retry
export const fetchWithRetry = async <T = unknown>(
  config: ApiConfig,
  endpoint: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>,
): Promise<ApiResponse<T>> => {
  const url = `${config.baseUrl}${endpoint}`
  const finalRetryConfig: RetryConfig = {
    retries: config.retries ?? 3,
    retryDelay: config.retryDelay ?? 1000,
    retryCondition: defaultRetryCondition,
    ...retryConfig,
  }

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
      ...options.headers,
    },
  }

  let lastError: ApiError

  for (let attempt = 1; attempt <= finalRetryConfig.retries + 1; attempt++) {
    try {
      return await executeRequest<T>(
        url,
        requestOptions,
        attempt,
        config.timeout ?? 10000,
      )
    } catch (error) {
      lastError = error as ApiError
      lastError.attempt = attempt

      // Si c'est le dernier essai ou si on ne doit pas retry
      if (
        attempt === finalRetryConfig.retries + 1 ||
        !finalRetryConfig.retryCondition!(lastError, attempt)
      ) {
        throw lastError
      }

      // Attendre avant le prochain essai
      const delay = calculateDelay(attempt, finalRetryConfig.retryDelay)
      console.warn(
        `API call failed (attempt ${attempt}/${finalRetryConfig.retries + 1}), retrying in ${delay}ms:`,
        lastError.message,
      )
      await sleep(delay)
    }
  }

  throw lastError!
}

export const createHttpMethods = (config: ApiConfig) => ({
  get: <T = unknown>(
    endpoint: string,
    options?: RequestInit,
    retryConfig?: Partial<RetryConfig>,
  ): Promise<ApiResponse<T>> =>
    fetchWithRetry<T>(
      config,
      endpoint,
      { ...options, method: 'GET' },
      retryConfig,
    ),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    retryConfig?: Partial<RetryConfig>,
  ): Promise<ApiResponse<T>> =>
    fetchWithRetry<T>(
      config,
      endpoint,
      {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      retryConfig,
    ),

  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    retryConfig?: Partial<RetryConfig>,
  ): Promise<ApiResponse<T>> =>
    fetchWithRetry<T>(
      config,
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      retryConfig,
    ),

  delete: <T = unknown>(
    endpoint: string,
    options?: RequestInit,
    retryConfig?: Partial<RetryConfig>,
  ): Promise<ApiResponse<T>> =>
    fetchWithRetry<T>(
      config,
      endpoint,
      { ...options, method: 'DELETE' },
      retryConfig,
    ),
})

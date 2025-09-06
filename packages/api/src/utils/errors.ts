import type { ApiError } from '../types'

export const createApiError = (
  message: string,
  status?: number,
  statusText?: string,
  url?: string,
  attempt?: number,
): ApiError => {
  const error = new Error(message) as ApiError
  error.name = 'ApiError'
  error.status = status
  error.statusText = statusText
  error.url = url
  error.attempt = attempt
  return error
}

export const createNetworkError = (
  message: string,
  url?: string,
  attempt?: number,
): ApiError => {
  const error = createApiError(message, undefined, undefined, url, attempt)
  error.name = 'NetworkError'
  return error
}

export const createTimeoutError = (
  message: string,
  url?: string,
  attempt?: number,
): ApiError => {
  const error = createApiError(message, undefined, undefined, url, attempt)
  error.name = 'TimeoutError'
  return error
}

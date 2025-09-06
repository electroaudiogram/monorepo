import type { ApiError } from '../types'

export const defaultRetryCondition = (error: ApiError): boolean => {
  // Retry sur les erreurs réseau, timeouts, et erreurs serveur (5xx)
  if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
    return true
  }

  // Retry sur les erreurs 5xx et quelques 4xx spécifiques
  if (error.status) {
    return error.status >= 500 || error.status === 429 || error.status === 408
  }

  return false
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Backoff exponentiel avec jitter
export const calculateDelay = (attempt: number, baseDelay: number): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1)
  const jitter = Math.random() * 0.1 * exponentialDelay
  return Math.min(exponentialDelay + jitter, 30000) // Max 30s
}

export interface ApiConfig {
  baseUrl: string
  timeout?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
}

export interface RetryConfig {
  retries: number
  retryDelay: number
  retryCondition?: (error: ApiError, attempt: number) => boolean
}

export interface ApiError extends Error {
  status?: number
  statusText?: string
  url?: string
  attempt?: number
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

export interface PayloadQuery {
  where?: Record<string, unknown>
  limit?: number
  page?: number
  sort?: string
  depth?: number
  locale?: string
  fallbackLocale?: string
  select?: Record<string, boolean>
  populate?: Record<string, boolean>
}

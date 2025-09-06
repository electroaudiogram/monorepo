import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import * as fs from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import loadEnv from './'

vi.mock('node:fs')
vi.mock('dotenv')
vi.mock('dotenv-expand')

describe('@electroaudiogram/load-env', () => {
  const mockExistsSync = fs.existsSync as unknown as ReturnType<typeof vi.fn>
  const mockDotenvConfig = dotenv.config as unknown as ReturnType<typeof vi.fn>
  const mockDotenvExpand = dotenvExpand.expand as unknown as ReturnType<
    typeof vi.fn
  >

  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('loads .env file when it exists', () => {
    mockExistsSync.mockReturnValue(true)
    mockDotenvConfig.mockReturnValue({ parsed: { TEST: '123' } })
    mockDotenvExpand.mockReturnValue({})

    loadEnv('../.env.test')

    expect(mockExistsSync).toHaveBeenCalled()
    expect(mockDotenvConfig).toHaveBeenCalledWith(
      expect.objectContaining({ path: expect.stringContaining('.env.test') }),
    )
    expect(mockDotenvExpand).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[env] loaded .env from'),
    )
  })

  it('logs a message when no .env file is found', () => {
    mockExistsSync.mockReturnValue(false)

    loadEnv('../.env.missing')

    expect(mockExistsSync).toHaveBeenCalled()
    expect(mockDotenvConfig).not.toHaveBeenCalled()
    expect(mockDotenvExpand).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      '[env] no .env file found, relying on process.env (Docker/CI/CD)',
    )
  })

  it('does not throw if dotenv.config returns undefined', () => {
    mockExistsSync.mockReturnValue(true)
    mockDotenvConfig.mockReturnValue(undefined)
    mockDotenvExpand.mockReturnValue({})

    expect(() => loadEnv('../.env.empty')).not.toThrow()
    expect(mockDotenvConfig).toHaveBeenCalled()
    expect(mockDotenvExpand).toHaveBeenCalled()
  })
})

import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './api'
import { cachePresets } from './cache'

const isClientError = (error: Error) =>
  error instanceof ApiError && error.status < 500

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...cachePresets.standard,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 2
    }
  }
})

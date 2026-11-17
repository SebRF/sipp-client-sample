import { useQuery } from '@tanstack/react-query'
import { useClientId } from '@/store'
import { get } from './api'
import { cachePresets } from './cache'
import { queryKeys } from './queryKeys'
import type { Client, FxRates } from './types'

export const useClient = () =>
  useQuery({
    queryKey: queryKeys.client(useClientId()),
    queryFn: () => get<Client>('/client'),
    ...cachePresets.reference
  })

export const useFxRates = () =>
  useQuery({
    queryKey: queryKeys.fxRates(),
    queryFn: () => get<FxRates>('/fx-rates'),
    ...cachePresets.reference
  })

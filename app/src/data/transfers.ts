import { useQuery } from '@tanstack/react-query'
import { useClientId } from '@/store'
import { get } from './api'
import { queryKeys } from './queryKeys'
import type { Transfer } from './types'

export const useTransfers = () =>
  useQuery({
    queryKey: queryKeys.transfers(useClientId()),
    queryFn: () => get<Transfer[]>('/transfers')
  })

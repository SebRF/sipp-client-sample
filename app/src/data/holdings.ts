import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useClientId } from '@/store'
import { get } from './api'
import { queryKeys } from './queryKeys'
import type { Holding } from './types'

export const useHoldings = () =>
  useQuery({
    queryKey: queryKeys.holdings.all(useClientId()),
    queryFn: () => get<Holding[]>('/holdings')
  })

export const useHolding = (id: string) => {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  return useQuery({
    queryKey: queryKeys.holdings.detail(clientId, id),
    queryFn: () => get<Holding>(`/holdings/${id}`),
    placeholderData: () =>
      queryClient
        .getQueryData<Holding[]>(queryKeys.holdings.all(clientId))
        ?.find(holding => holding.id === id)
  })
}

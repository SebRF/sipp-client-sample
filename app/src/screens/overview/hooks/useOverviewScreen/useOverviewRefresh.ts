import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/data/queryKeys'
import { useRefresh } from '@/hooks/useRefresh'
import { useClientId } from '@/store'

export const useOverviewRefresh = () => {
  const queryClient = useQueryClient()
  const clientId = useClientId()

  return useRefresh(() =>
    Promise.all(
      [
        queryKeys.client(clientId),
        queryKeys.cashAccounts(clientId),
        queryKeys.cashMoves(clientId),
        queryKeys.holdings.all(clientId),
        queryKeys.transfers(clientId)
      ].map(queryKey => queryClient.invalidateQueries({ queryKey }))
    )
  )
}

import { router } from 'expo-router'
import { useHoldings } from '@/data/holdings'
import { useRefresh } from '@/hooks/useRefresh'

export const usePortfolioScreen = () => {
  const holdings = useHoldings()
  const { refreshing, refresh } = useRefresh(() => holdings.refetch())

  return {
    holdings: holdings.data ?? [],
    isLoading: holdings.isPending,
    error: holdings.error,
    retry: holdings.refetch,
    refreshing,
    refresh,
    onOpenHolding: (id: string) => router.push(`/holdings/${id}`)
  }
}

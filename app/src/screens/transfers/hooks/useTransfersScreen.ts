import { useMemo } from 'react'
import { useTransfers } from '@/data/transfers'
import { useRefresh } from '@/hooks/useRefresh'
import { formatMoney } from '@/utils/money'
import { toTimeline } from '../helpers/toTimeline'

export const useTransfersScreen = () => {
  const transfers = useTransfers()
  const { refreshing, refresh } = useRefresh(() => transfers.refetch())

  const items = useMemo(
    () =>
      (transfers.data ?? [])
        .map(transfer => ({
          id: transfer.id,
          title: transfer.cedingScheme,
          amount: formatMoney(transfer.amount, transfer.currency),
          complete: transfer.stage === 'invested',
          steps: toTimeline(transfer)
        }))
        .sort((a, b) => Number(a.complete) - Number(b.complete)),
    [transfers.data]
  )

  return {
    items,
    isLoading: transfers.isPending,
    error: transfers.error,
    retry: transfers.refetch,
    refreshing,
    refresh
  }
}

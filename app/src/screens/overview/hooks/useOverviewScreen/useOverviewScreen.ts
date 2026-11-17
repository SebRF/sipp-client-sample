import { router } from 'expo-router'
import { useMemo } from 'react'
import { useAppStore } from '@/store'
import { formatMoney } from '@/utils/money'
import { getOverviewTotals } from '../../helpers/getOverviewTotals'
import { useOverviewData } from './useOverviewData'
import { useOverviewRefresh } from './useOverviewRefresh'

export const useOverviewScreen = () => {
  const data = useOverviewData()
  const { refreshing, refresh } = useOverviewRefresh()
  const displayCurrency = useAppStore(state => state.displayCurrency)
  const setDisplayCurrency = useAppStore(state => state.setDisplayCurrency)
  const { cashAccounts, holdings, fxRates, cashMoves, transfers } = data

  const totals = useMemo(
    () =>
      cashAccounts && holdings && fxRates
        ? getOverviewTotals({
            cashAccounts,
            holdings,
            fxRates,
            currency: displayCurrency
          })
        : null,
    [cashAccounts, holdings, fxRates, displayCurrency]
  )

  const recentMoves = useMemo(() => {
    const currencyOf = (id: string) =>
      cashAccounts?.find(account => account.id === id)?.currency ?? 'GBP'
    return (cashMoves ?? []).slice(0, 3).map(move => ({
      id: move.id,
      pending: move.status === 'pending',
      label: `${formatMoney(move.amount, currencyOf(move.fromAccountId))} → ${formatMoney(
        move.toAmount,
        currencyOf(move.toAccountId)
      )}`
    }))
  }, [cashMoves, cashAccounts])

  const transfersInProgress = (transfers ?? [])
    .filter(transfer => transfer.stage !== 'invested')
    .map(transfer => ({
      ...transfer,
      stageLabel:
        transfer.stages.find(stage => stage.key === transfer.stage)?.label ?? ''
    }))

  return {
    isLoading: data.isLoading,
    error: data.error,
    retry: data.retry,
    refreshing,
    refresh,
    firstName: data.client?.name.split(' ')[0] ?? '',
    planNumber: data.client?.planNumber ?? '',
    totals,
    displayCurrency,
    setDisplayCurrency,
    cashAccounts: cashAccounts ?? [],
    recentMoves,
    transfersInProgress,
    onMoveCash: () => router.push('/move-cash'),
    onOpenTransfers: () => router.push('/transfers')
  }
}

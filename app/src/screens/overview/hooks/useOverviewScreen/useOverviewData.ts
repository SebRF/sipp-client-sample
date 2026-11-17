import { useCashAccounts, useCashMoves } from '@/data/cashMoves'
import { useClient, useFxRates } from '@/data/client'
import { useHoldings } from '@/data/holdings'
import { useTransfers } from '@/data/transfers'

export const useOverviewData = () => {
  const client = useClient()
  const fxRates = useFxRates()
  const cashAccounts = useCashAccounts()
  const cashMoves = useCashMoves()
  const holdings = useHoldings()
  const transfers = useTransfers()

  const queries = [
    client,
    fxRates,
    cashAccounts,
    cashMoves,
    holdings,
    transfers
  ]
  const failed = queries.filter(query => query.isError)

  return {
    client: client.data,
    fxRates: fxRates.data,
    cashAccounts: cashAccounts.data,
    cashMoves: cashMoves.data,
    holdings: holdings.data,
    transfers: transfers.data,
    isLoading: queries.some(query => query.isPending),
    error: failed[0]?.error ?? null,
    retry: () => failed.forEach(query => query.refetch())
  }
}

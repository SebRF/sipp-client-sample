import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useClientId } from '@/store'
import { convert, rateBetween, roundMoney } from '@/utils/money'
import { get, post } from './api'
import { Intervals } from './cache'
import { queryKeys } from './queryKeys'
import type { CashAccount, CashMove, CashMoveInput, FxRates } from './types'

export const useCashAccounts = () =>
  useQuery({
    queryKey: queryKeys.cashAccounts(useClientId()),
    queryFn: () => get<CashAccount[]>('/cash-accounts')
  })

export const useCashMoves = () =>
  useQuery({
    queryKey: queryKeys.cashMoves(useClientId()),
    queryFn: () => get<CashMove[]>('/cash-moves'),
    refetchInterval: query =>
      query.state.data?.some(move => move.status === 'pending')
        ? Intervals.THREE_SEC
        : false
  })

export const previewCashMove = (
  accounts: CashAccount[],
  input: CashMoveInput,
  fxRates: FxRates
) => {
  const from = accounts.find(a => a.id === input.fromAccountId)
  const to = accounts.find(a => a.id === input.toAccountId)
  if (!from || !to) return null

  const toAmount = convert(input.amount, from.currency, to.currency, fxRates)
  const move: CashMove = {
    ...input,
    id: `optimistic-${Date.now()}`,
    toAmount,
    rate: rateBetween(from.currency, to.currency, fxRates),
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  const nextAccounts = accounts.map(account => {
    if (account.id === from.id)
      return { ...account, balance: roundMoney(account.balance - input.amount) }
    if (account.id === to.id)
      return { ...account, balance: roundMoney(account.balance + toAmount) }
    return account
  })
  return { move, accounts: nextAccounts }
}

export const useMoveCash = () => {
  const queryClient = useQueryClient()
  const clientId = useClientId()
  const accountsKey = queryKeys.cashAccounts(clientId)
  const movesKey = queryKeys.cashMoves(clientId)

  return useMutation({
    mutationFn: (input: CashMoveInput) => post<CashMove>('/cash-moves', input),
    onMutate: async input => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: accountsKey }),
        queryClient.cancelQueries({ queryKey: movesKey })
      ])
      const previous = {
        accounts: queryClient.getQueryData<CashAccount[]>(accountsKey),
        moves: queryClient.getQueryData<CashMove[]>(movesKey)
      }
      const fxRates = queryClient.getQueryData<FxRates>(queryKeys.fxRates())
      const preview =
        previous.accounts && fxRates
          ? previewCashMove(previous.accounts, input, fxRates)
          : null

      if (preview) {
        queryClient.setQueryData(accountsKey, preview.accounts)
        queryClient.setQueryData<CashMove[]>(movesKey, moves => [
          preview.move,
          ...(moves ?? [])
        ])
      }
      return previous
    },
    onError: (_error, _input, previous) => {
      queryClient.setQueryData(accountsKey, previous?.accounts)
      queryClient.setQueryData(movesKey, previous?.moves)
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: accountsKey }),
        queryClient.invalidateQueries({ queryKey: movesKey })
      ])
  })
}

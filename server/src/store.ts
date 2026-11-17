import * as seed from './seed.ts'
import type { CashMove, CashMoveInput } from './types.ts'

export type CashMoveResult =
  | { ok: true; move: CashMove }
  | { ok: false; error: string }

const round2 = (value: number) => Math.round(value * 100) / 100
// Conversions round down so a round trip can never create money.
const floor2 = (value: number) => Math.floor(value * 100 + 1e-6) / 100

export const createStore = () => {
  const cashAccounts = structuredClone(seed.cashAccounts)
  const cashMoves = structuredClone(seed.cashMoves)
  let nextId = cashMoves.length + 1

  const applyCashMove = (
    { fromAccountId, toAccountId, amount }: CashMoveInput,
    now = new Date()
  ): CashMoveResult => {
    const from = cashAccounts.find(a => a.id === fromAccountId)
    const to = cashAccounts.find(a => a.id === toAccountId)

    if (!from || !to) return { ok: false, error: 'Unknown account' }
    if (from.id === to.id)
      return { ok: false, error: 'Choose two different accounts' }
    if (!Number.isFinite(amount) || amount <= 0)
      return { ok: false, error: 'Enter an amount above zero' }
    if (round2(amount) !== amount)
      return { ok: false, error: 'Use at most two decimal places' }
    if (amount > from.balance)
      return { ok: false, error: `Not enough ${from.currency} cash` }

    const { rates } = seed.fxRates
    const rate = Math.round((rates[to.currency] / rates[from.currency]) * 1e6) / 1e6
    const toAmount = floor2(amount * rate)
    if (toAmount <= 0)
      return { ok: false, error: 'Amount too small to convert' }

    from.balance = round2(from.balance - amount)
    to.balance = round2(to.balance + toAmount)

    const move: CashMove = {
      id: `mv_${nextId++}`,
      fromAccountId,
      toAccountId,
      amount,
      toAmount,
      rate,
      status: 'pending',
      createdAt: now.toISOString()
    }
    cashMoves.unshift(move)
    return { ok: true, move }
  }

  const settleCashMove = (id: string) => {
    const move = cashMoves.find(m => m.id === id)
    if (move) move.status = 'settled'
  }

  return {
    client: seed.client,
    fxRates: seed.fxRates,
    holdings: seed.holdings,
    transfers: seed.transfers,
    cashAccounts,
    cashMoves,
    applyCashMove,
    settleCashMove
  }
}

import type { CashAccount, CashMoveInput } from '@/data/types'

type ValidationResult =
  { ok: true; input: CashMoveInput } | { ok: false; error: string }

type CashMoveDraft = {
  from?: CashAccount
  to?: CashAccount
  amountText: string
}

export const validateCashMove = ({
  from,
  to,
  amountText
}: CashMoveDraft): ValidationResult => {
  const text = amountText.replace(/,/g, '').trim()
  const amount = Number(text)

  if (!from || !to) return { ok: false, error: 'Choose both accounts' }
  if (from.id === to.id)
    return { ok: false, error: 'Choose two different accounts' }
  if (!text) return { ok: false, error: 'Enter an amount' }
  if (!Number.isFinite(amount) || amount <= 0)
    return { ok: false, error: 'Enter an amount above zero' }
  if (!/^\d+(\.\d{1,2})?$/.test(text))
    return { ok: false, error: 'Use at most two decimal places' }
  if (amount > from.balance)
    return { ok: false, error: `Not enough ${from.currency} cash` }

  return {
    ok: true,
    input: { fromAccountId: from.id, toAccountId: to.id, amount }
  }
}

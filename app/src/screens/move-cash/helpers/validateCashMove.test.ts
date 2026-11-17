import type { CashAccount } from '@/data/types'
import { validateCashMove } from './validateCashMove'

const gbp: CashAccount = { id: 'acc_gbp', currency: 'GBP', balance: 500 }
const eur: CashAccount = { id: 'acc_eur', currency: 'EUR', balance: 0 }

describe('validateCashMove', () => {
  it('accepts a valid move and ignores spaces and commas', () => {
    expect(
      validateCashMove({ from: gbp, to: eur, amountText: ' 1,20.50 ' })
    ).toEqual({
      ok: true,
      input: { fromAccountId: 'acc_gbp', toAccountId: 'acc_eur', amount: 120.5 }
    })
  })

  it.each([
    [{ from: gbp, to: gbp, amountText: '10' }, 'Choose two different accounts'],
    [{ from: gbp, to: eur, amountText: '' }, 'Enter an amount'],
    [{ from: gbp, to: eur, amountText: '0' }, 'Enter an amount above zero'],
    [{ from: gbp, to: eur, amountText: 'abc' }, 'Enter an amount above zero'],
    [
      { from: gbp, to: eur, amountText: '1.234' },
      'Use at most two decimal places'
    ],
    [{ from: gbp, to: eur, amountText: '500.01' }, 'Not enough GBP cash'],
    [{ to: eur, amountText: '10' }, 'Choose both accounts']
  ])('rejects %o', (draft, error) => {
    expect(validateCashMove(draft)).toEqual({ ok: false, error })
  })
})

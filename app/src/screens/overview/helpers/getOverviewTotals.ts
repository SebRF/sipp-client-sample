import type { CashAccount, Currency, FxRates, Holding } from '@/data/types'
import { convert, roundMoney } from '@/utils/money'

type TotalsInput = {
  cashAccounts: CashAccount[]
  holdings: Holding[]
  fxRates: FxRates
  currency: Currency
}

export const getOverviewTotals = ({
  cashAccounts,
  holdings,
  fxRates,
  currency
}: TotalsInput) => {
  const sumIn = (items: { amount: number; currency: Currency }[]) =>
    roundMoney(
      items.reduce(
        (sum, item) =>
          sum + convert(item.amount, item.currency, currency, fxRates),
        0
      )
    )

  const cash = sumIn(
    cashAccounts.map(a => ({ amount: a.balance, currency: a.currency }))
  )
  const investments = sumIn(
    holdings.map(h => ({ amount: h.value, currency: h.currency }))
  )
  return { cash, investments, total: roundMoney(cash + investments) }
}

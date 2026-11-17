import { useCashAccounts } from '@/data/cashMoves'
import { useFxRates } from '@/data/client'
import type { Currency } from '@/data/types'
import { convert, formatMoney } from '@/utils/money'
import { validateCashMove } from '../../helpers/validateCashMove'
import { useMoveCashForm } from './useMoveCashForm'
import { useMoveCashSubmit } from './useMoveCashSubmit'

export const useMoveCashScreen = () => {
  const accounts = useCashAccounts()
  const fxRates = useFxRates()
  const form = useMoveCashForm()
  const { submit, isSubmitting, serverError, clearServerError } =
    useMoveCashSubmit()

  const accountFor = (currency: Currency) =>
    accounts.data?.find(account => account.currency === currency)
  const from = accountFor(form.fromCurrency)
  const to = accountFor(form.toCurrency)
  const validation = validateCashMove({ from, to, amountText: form.amountText })

  const preview =
    validation.ok && fxRates.data
      ? `They receive ${formatMoney(
          convert(
            validation.input.amount,
            form.fromCurrency,
            form.toCurrency,
            fxRates.data
          ),
          form.toCurrency
        )}`
      : null

  const edit =
    <T>(setter: (value: T) => void) =>
    (value: T) => {
      clearServerError()
      setter(value)
    }

  return {
    isLoading: accounts.isPending,
    fromCurrency: form.fromCurrency,
    toCurrency: form.toCurrency,
    setFromCurrency: edit(form.setFromCurrency),
    setToCurrency: edit(form.setToCurrency),
    amountText: form.amountText,
    setAmountText: edit(form.setAmountText),
    available: from ? formatMoney(from.balance, from.currency) : '',
    preview,
    error:
      serverError ??
      (!validation.ok && (form.attempted || form.amountText)
        ? validation.error
        : null),
    isSubmitting,
    submit: () => {
      form.markAttempted()
      if (validation.ok) submit(validation.input)
    }
  }
}

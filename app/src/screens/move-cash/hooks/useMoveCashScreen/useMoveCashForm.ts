import { useState } from 'react'
import type { Currency } from '@/data/types'

export const useMoveCashForm = () => {
  const [fromCurrency, setFromCurrency] = useState<Currency>('GBP')
  const [toCurrency, setToCurrency] = useState<Currency>('EUR')
  const [amountText, setAmountText] = useState('')
  const [attempted, setAttempted] = useState(false)

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amountText,
    setAmountText,
    attempted,
    markAttempted: () => setAttempted(true)
  }
}

import type { Currency, FxRates } from '@/data/types'

const round = (value: number, places: number) =>
  Math.round(value * 10 ** places) / 10 ** places

export const roundMoney = (value: number) => round(value, 2)

// Conversions round down, matching the server, so a round trip never gains.
const floorMoney = (value: number) => Math.floor(value * 100 + 1e-6) / 100

export const rateBetween = (from: Currency, to: Currency, { rates }: FxRates) =>
  round(rates[to] / rates[from], 6)

export const convert = (
  amount: number,
  from: Currency,
  to: Currency,
  fxRates: FxRates
) => floorMoney(amount * rateBetween(from, to, fxRates))

export const formatMoney = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount)

export const formatPct = (value: number) =>
  `${value > 0 ? '+' : ''}${value.toFixed(2)}%`

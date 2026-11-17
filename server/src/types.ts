export type Currency = 'GBP' | 'EUR' | 'USD' | 'AUD'

export type Client = {
  id: string
  name: string
  planNumber: string
  baseCurrency: Currency
}

export type FxRates = { base: 'GBP'; rates: Record<Currency, number> }

export type CashAccount = { id: string; currency: Currency; balance: number }

export type Holding = {
  id: string
  name: string
  isin: string
  currency: Currency
  units: number
  price: number
  value: number
  dayChangePct: number
  allocationPct: number
  about: string
}

export type TransferStageKey = 'requested' | 'contacted' | 'received' | 'invested'

export type Transfer = {
  id: string
  cedingScheme: string
  amount: number
  currency: Currency
  stage: TransferStageKey
  stages: { key: TransferStageKey; label: string; at?: string }[]
}

export type CashMoveStatus = 'pending' | 'settled'

export type CashMove = {
  id: string
  fromAccountId: string
  toAccountId: string
  amount: number
  toAmount: number
  rate: number
  status: CashMoveStatus
  createdAt: string
}

export type CashMoveInput = {
  fromAccountId: string
  toAccountId: string
  amount: number
}

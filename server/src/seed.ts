import type {
  CashAccount,
  CashMove,
  Client,
  FxRates,
  Holding,
  Transfer,
  TransferStageKey
} from './types.ts'

export const client: Client = {
  id: 'c_1',
  name: 'Alex Morgan',
  planNumber: 'SIPP-004821',
  baseCurrency: 'GBP'
}

export const fxRates: FxRates = {
  base: 'GBP',
  rates: { GBP: 1, EUR: 1.17, USD: 1.27, AUD: 1.93 }
}

export const cashAccounts: CashAccount[] = [
  { id: 'acc_gbp', currency: 'GBP', balance: 8250 },
  { id: 'acc_eur', currency: 'EUR', balance: 4120.5 },
  { id: 'acc_usd', currency: 'USD', balance: 2300 },
  { id: 'acc_aud', currency: 'AUD', balance: 950 }
]

const funds: Omit<Holding, 'value' | 'allocationPct'>[] = [
  {
    id: 'h_global',
    name: 'Global Equity Index (demo)',
    isin: 'GB00SAMPLE01',
    currency: 'USD',
    units: 1200,
    price: 48.2,
    dayChangePct: 0.84,
    about: 'Tracks a broad index of developed-market shares. Sample data.'
  },
  {
    id: 'h_gilts',
    name: 'UK Gilts Fund (demo)',
    isin: 'GB00SAMPLE02',
    currency: 'GBP',
    units: 3500,
    price: 9.84,
    dayChangePct: -0.12,
    about: 'Holds UK government bonds of mixed maturity. Sample data.'
  },
  {
    id: 'h_europe',
    name: 'European Equity Fund (demo)',
    isin: 'GB00SAMPLE03',
    currency: 'EUR',
    units: 800,
    price: 31.75,
    dayChangePct: 0.31,
    about: 'Invests in large companies listed in the eurozone. Sample data.'
  },
  {
    id: 'h_property',
    name: 'Australian Property Trust (demo)',
    isin: 'GB00SAMPLE04',
    currency: 'AUD',
    units: 2000,
    price: 12.1,
    dayChangePct: -0.47,
    about: 'Owns a spread of Australian commercial property. Sample data.'
  }
]

const toGbp = (amount: number, currency: Holding['currency']) =>
  amount / fxRates.rates[currency]

const valued = funds.map(fund => ({
  ...fund,
  value: Math.round(fund.units * fund.price * 100) / 100
}))
const totalGbp = valued.reduce((sum, h) => sum + toGbp(h.value, h.currency), 0)

export const holdings: Holding[] = valued.map(holding => ({
  ...holding,
  allocationPct:
    Math.round((toGbp(holding.value, holding.currency) / totalGbp) * 1000) / 10
}))

const stageLabels: Record<TransferStageKey, string> = {
  requested: 'Transfer requested',
  contacted: 'Previous provider contacted',
  received: 'Funds received',
  invested: 'Invested'
}

const stages = (dates: Partial<Record<TransferStageKey, string>>) =>
  (Object.keys(stageLabels) as TransferStageKey[]).map(key => ({
    key,
    label: stageLabels[key],
    at: dates[key]
  }))

export const transfers: Transfer[] = [
  {
    id: 't_1',
    cedingScheme: 'Former employer pension (demo)',
    amount: 42000,
    currency: 'GBP',
    stage: 'received',
    stages: stages({
      requested: '2026-10-02',
      contacted: '2026-10-06',
      received: '2026-11-10'
    })
  },
  {
    id: 't_2',
    cedingScheme: 'Personal pension (demo)',
    amount: 15500,
    currency: 'GBP',
    stage: 'contacted',
    stages: stages({ requested: '2026-10-28', contacted: '2026-11-03' })
  },
  {
    id: 't_3',
    cedingScheme: 'Overseas scheme (demo)',
    amount: 23000,
    currency: 'EUR',
    stage: 'invested',
    stages: stages({
      requested: '2026-06-11',
      contacted: '2026-06-15',
      received: '2026-07-22',
      invested: '2026-07-24'
    })
  }
]

export const cashMoves: CashMove[] = [
  {
    id: 'mv_1',
    fromAccountId: 'acc_gbp',
    toAccountId: 'acc_eur',
    amount: 1000,
    toAmount: 1170,
    rate: 1.17,
    status: 'settled',
    createdAt: '2026-11-02T09:14:00.000Z'
  }
]

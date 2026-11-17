import type { FxRates } from '@/data/types'
import { convert, formatMoney, formatPct, rateBetween } from './money'

const fxRates: FxRates = {
  base: 'GBP',
  rates: { GBP: 1, EUR: 1.17, USD: 1.27, AUD: 1.93 }
}

describe('money', () => {
  it('converts through the base currency', () => {
    expect(convert(100, 'GBP', 'EUR', fxRates)).toBe(117)
    expect(convert(127, 'USD', 'GBP', fxRates)).toBe(100)
    expect(rateBetween('EUR', 'USD', fxRates)).toBe(1.08547)
  })

  it('rounds converted amounts down to pennies', () => {
    expect(convert(10, 'EUR', 'AUD', fxRates)).toBe(16.49)
    expect(convert(0.01, 'AUD', 'GBP', fxRates)).toBe(0)
  })

  it('formats for display', () => {
    expect(formatMoney(1234.5, 'GBP')).toBe('£1,234.50')
    expect(formatPct(0.84)).toBe('+0.84%')
    expect(formatPct(-0.12)).toBe('-0.12%')
  })
})

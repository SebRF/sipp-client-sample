import type { StateCreator } from 'zustand'
import type { Currency } from '@/data/types'

export type PreferencesSlice = {
  displayCurrency: Currency
  setDisplayCurrency: (currency: Currency) => void
}

export const createPreferencesSlice: StateCreator<PreferencesSlice> = set => ({
  displayCurrency: 'GBP',
  setDisplayCurrency: displayCurrency => set({ displayCurrency })
})

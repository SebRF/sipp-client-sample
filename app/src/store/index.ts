import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  createPreferencesSlice,
  type PreferencesSlice
} from './preferencesSlice'
import { createSessionSlice, type SessionSlice } from './sessionSlice'

type AppState = SessionSlice & PreferencesSlice

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSessionSlice(...a),
      ...createPreferencesSlice(...a)
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Tokens belong in the keychain (expo-secure-store), never AsyncStorage.
      partialize: ({ displayCurrency }) => ({ displayCurrency })
    }
  )
)

export const useClientId = () => useAppStore(state => state.clientId)

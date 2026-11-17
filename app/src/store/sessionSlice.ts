import type { StateCreator } from 'zustand'

export type SessionSlice = {
  token: string
  clientId: string
}

export const createSessionSlice: StateCreator<SessionSlice> = () => ({
  token: process.env.EXPO_PUBLIC_DEMO_TOKEN ?? 'demo-token',
  clientId: 'c_1'
})

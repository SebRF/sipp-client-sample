import Constants from 'expo-constants'
import { useAppStore } from '@/store'

const devHost = Constants.expoConfig?.hostUri?.split(':')[0]

export const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${devHost ?? 'localhost'}:4000`

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const { token } = useAppStore.getState()
  const response = await fetch(`${apiUrl}/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error ?? `Request failed (${response.status})`
    )
  }
  return body as T
}

export const get = <T>(path: string) => request<T>(path)

export const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })

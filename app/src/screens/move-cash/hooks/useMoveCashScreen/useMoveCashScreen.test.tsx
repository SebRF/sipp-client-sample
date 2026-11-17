import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { ApiError, get, post } from '@/data/api'
import { queryKeys } from '@/data/queryKeys'
import type { CashAccount, CashMove, FxRates } from '@/data/types'
import { useAppStore } from '@/store'
import { useMoveCashScreen } from './useMoveCashScreen'

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock'
  )
)
jest.mock('expo-router', () => ({ router: { back: jest.fn() } }))
jest.mock('@/data/api', () => ({
  ...jest.requireActual('@/data/api'),
  get: jest.fn(),
  post: jest.fn()
}))

const accounts: CashAccount[] = [
  { id: 'acc_gbp', currency: 'GBP', balance: 1000 },
  { id: 'acc_eur', currency: 'EUR', balance: 0 }
]
const { clientId } = useAppStore.getState()
const fxRates: FxRates = {
  base: 'GBP',
  rates: { GBP: 1, EUR: 1.17, USD: 1.27, AUD: 1.93 }
}

const setup = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity }
    }
  })
  queryClient.setQueryData(queryKeys.cashAccounts(clientId), accounts)
  queryClient.setQueryData(queryKeys.cashMoves(clientId), [])
  queryClient.setQueryData(queryKeys.fxRates(), fxRates)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const { result } = await renderHook(useMoveCashScreen, { wrapper })
  return { queryClient, result }
}

const deferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useMoveCashScreen', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows the move as pending straight away, then closes', async () => {
    const response = deferred<CashMove>()
    jest.mocked(post).mockReturnValue(response.promise)
    jest.mocked(get).mockResolvedValue([])
    const { queryClient, result } = await setup()

    await act(() => result.current.setAmountText('100'))
    expect(result.current.preview).toBe('They receive €117.00')
    await act(() => result.current.submit())

    await waitFor(() =>
      expect(
        queryClient.getQueryData(queryKeys.cashAccounts(clientId))
      ).toEqual([
        { id: 'acc_gbp', currency: 'GBP', balance: 900 },
        { id: 'acc_eur', currency: 'EUR', balance: 117 }
      ])
    )
    expect(
      queryClient.getQueryData<CashMove[]>(queryKeys.cashMoves(clientId))?.[0]
    ).toMatchObject({ amount: 100, toAmount: 117, status: 'pending' })

    await act(async () => response.resolve({} as CashMove))
    await waitFor(() => expect(router.back).toHaveBeenCalled())
  })

  it('rolls back and shows the server error when the move is refused', async () => {
    jest
      .mocked(post)
      .mockRejectedValue(new ApiError(422, 'Not enough GBP cash'))
    jest
      .mocked(get)
      .mockImplementation(async path =>
        path === '/cash-accounts' ? accounts : []
      )
    const { queryClient, result } = await setup()

    await act(() => result.current.setAmountText('100'))
    await act(() => result.current.submit())

    await waitFor(() =>
      expect(result.current.error).toBe('Not enough GBP cash')
    )
    expect(queryClient.getQueryData(queryKeys.cashAccounts(clientId))).toEqual(
      accounts
    )
    expect(queryClient.getQueryData(queryKeys.cashMoves(clientId))).toEqual([])
    expect(router.back).not.toHaveBeenCalled()
  })
})

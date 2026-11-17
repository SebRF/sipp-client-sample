import { router } from 'expo-router'
import { useMoveCash } from '@/data/cashMoves'
import type { CashMoveInput } from '@/data/types'

export const useMoveCashSubmit = () => {
  const moveCash = useMoveCash()

  return {
    submit: (input: CashMoveInput) =>
      moveCash.mutate(input, { onSuccess: () => router.back() }),
    isSubmitting: moveCash.isPending,
    serverError: moveCash.error?.message ?? null,
    clearServerError: moveCash.reset
  }
}

import { useLocalSearchParams } from 'expo-router'
import { useHolding } from '@/data/holdings'
import { formatMoney, formatPct } from '@/utils/money'

export const useHoldingDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const holding = useHolding(id)
  const data = holding.data

  const facts = data
    ? [
        { label: 'Value', value: formatMoney(data.value, data.currency) },
        { label: 'Units', value: data.units.toLocaleString('en-GB') },
        { label: 'Price', value: formatMoney(data.price, data.currency) },
        { label: 'Day change', value: formatPct(data.dayChangePct) },
        { label: 'Share of investments', value: `${data.allocationPct}%` },
        { label: 'ISIN', value: data.isin }
      ]
    : []

  return {
    holding: data,
    facts,
    error: holding.error,
    retry: holding.refetch
  }
}

import { Text, type TextProps } from '@/components/atoms/Text'
import type { Currency } from '@/data/types'
import { formatMoney } from '@/utils/money'

type MoneyProps = TextProps & { amount: number; currency: Currency }

export const Money = ({ amount, currency, ...props }: MoneyProps) => (
  <Text {...props}>{formatMoney(amount, currency)}</Text>
)

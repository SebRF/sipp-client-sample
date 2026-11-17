import { View } from 'react-native'
import { Text } from '@/components/atoms'

const tones = {
  positive: { box: 'bg-positive-soft', text: 'positive' },
  pending: { box: 'bg-pending-soft', text: 'pending' },
  neutral: { box: 'bg-brand-soft', text: 'brand' }
} as const

type StatusChipProps = { label: string; tone: keyof typeof tones }

export const StatusChip = ({ label, tone }: StatusChipProps) => (
  <View className={`self-start rounded-full px-2.5 py-1 ${tones[tone].box}`}>
    <Text variant='caption' tone={tones[tone].text}>
      {label}
    </Text>
  </View>
)

import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Pressable, Text } from '@/components/atoms'

type ListRowProps = {
  title: string
  subtitle?: string
  right?: ReactNode
  onPress?: () => void
}

export const ListRow = ({ title, subtitle, right, onPress }: ListRowProps) => {
  const content = (
    <View className='flex-row items-center gap-3 py-2'>
      <View className='flex-1 gap-0.5'>
        <Text variant='label' tone='ink'>
          {title}
        </Text>
        {subtitle ? <Text variant='caption'>{subtitle}</Text> : null}
      </View>
      {right}
      {onPress ? <Text tone='muted'>›</Text> : null}
    </View>
  )
  return onPress ? (
    <Pressable accessibilityRole='button' onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  )
}

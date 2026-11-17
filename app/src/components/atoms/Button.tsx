import { ActivityIndicator } from 'react-native'
import colors from '@/theme/colors.json'
import { Pressable } from './Pressable'
import { Text } from './Text'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false
}: ButtonProps) => {
  const primary = variant === 'primary'
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      className={`h-12 items-center justify-center rounded-xl px-4 ${
        primary ? 'bg-brand' : 'bg-brand-soft'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      {loading ? (
        <ActivityIndicator
          color={primary ? colors.surface : colors.brand.DEFAULT}
        />
      ) : (
        <Text variant='label' tone={primary ? 'inverse' : 'brand'}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}

import { Text as RNText, type TextProps as RNTextProps } from 'react-native'

const variants = {
  title: 'text-3xl font-semibold',
  heading: 'text-lg font-semibold',
  body: 'text-base',
  label: 'text-sm font-medium',
  caption: 'text-xs'
}

const tones = {
  ink: 'text-ink',
  muted: 'text-muted',
  brand: 'text-brand',
  inverse: 'text-white',
  positive: 'text-positive',
  negative: 'text-negative',
  pending: 'text-pending'
}

export type TextProps = RNTextProps & {
  variant?: keyof typeof variants
  tone?: keyof typeof tones
  className?: string
}

export const Text = ({
  variant = 'body',
  tone = variant === 'caption' || variant === 'label' ? 'muted' : 'ink',
  className = '',
  ...props
}: TextProps) => (
  <RNText
    className={`${variants[variant]} ${tones[tone]} ${className}`}
    {...props}
  />
)

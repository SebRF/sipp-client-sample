import { View, type ViewProps } from 'react-native'
import { Text } from './Text'

type CardProps = ViewProps & { title?: string; className?: string }

export const Card = ({
  title,
  className = '',
  children,
  ...props
}: CardProps) => (
  <View
    className={`gap-3 rounded-card border border-line bg-surface p-4 ${className}`}
    {...props}
  >
    {title ? <Text variant='heading'>{title}</Text> : null}
    {children}
  </View>
)

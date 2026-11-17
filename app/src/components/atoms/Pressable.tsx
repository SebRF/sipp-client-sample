import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps
} from 'react-native'

export type PressableProps = RNPressableProps & { className?: string }

export const Pressable = ({ className = '', ...props }: PressableProps) => (
  <RNPressable className={`active:opacity-60 ${className}`} {...props} />
)

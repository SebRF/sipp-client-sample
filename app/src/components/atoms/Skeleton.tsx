import { View } from 'react-native'

export const Skeleton = ({
  className = 'h-5 w-full'
}: {
  className?: string
}) => (
  <View
    accessibilityLabel='Loading'
    className={`rounded-lg bg-line ${className}`}
  />
)

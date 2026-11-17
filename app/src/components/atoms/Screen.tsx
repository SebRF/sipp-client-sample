import type { ReactNode } from 'react'
import { RefreshControl, ScrollView } from 'react-native'

type ScreenProps = {
  children: ReactNode
  refreshing?: boolean
  onRefresh?: () => void
}

export const Screen = ({
  children,
  refreshing = false,
  onRefresh
}: ScreenProps) => (
  <ScrollView
    className='flex-1 bg-canvas'
    contentInsetAdjustmentBehavior='automatic'
    contentContainerClassName='gap-4 p-4 pb-12'
    refreshControl={
      onRefresh ? (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      ) : undefined
    }
  >
    {children}
  </ScrollView>
)

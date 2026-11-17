import { View } from 'react-native'
import { Card, Screen, Skeleton, Text } from '@/components/atoms'
import { EmptyState, ErrorState, StatusChip } from '@/components/molecules'
import { TransferTimeline } from './components/TransferTimeline'
import { useTransfersScreen } from './hooks/useTransfersScreen'

export const TransfersScreen = () => {
  const transfers = useTransfersScreen()

  if (transfers.isLoading) {
    return (
      <Screen>
        {[0, 1].map(key => (
          <Card key={key}>
            <Skeleton className='h-5 w-2/3' />
            <Skeleton className='h-28 w-full' />
          </Card>
        ))}
      </Screen>
    )
  }

  if (transfers.error) {
    return (
      <Screen>
        <ErrorState error={transfers.error} onRetry={transfers.retry} />
      </Screen>
    )
  }

  return (
    <Screen refreshing={transfers.refreshing} onRefresh={transfers.refresh}>
      {transfers.items.length ? (
        transfers.items.map(item => (
          <Card key={item.id}>
            <View className='flex-row items-start justify-between gap-3'>
              <View className='flex-1 gap-0.5'>
                <Text variant='heading'>{item.title}</Text>
                <Text variant='caption'>{item.amount}</Text>
              </View>
              <StatusChip
                label={item.complete ? 'Complete' : 'In progress'}
                tone={item.complete ? 'positive' : 'pending'}
              />
            </View>
            <TransferTimeline steps={item.steps} />
          </Card>
        ))
      ) : (
        <EmptyState message='No transfers yet.' />
      )}
    </Screen>
  )
}

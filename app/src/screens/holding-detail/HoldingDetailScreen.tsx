import { Stack } from 'expo-router'
import { Card, Screen, Skeleton, Text } from '@/components/atoms'
import { ErrorState, ListRow } from '@/components/molecules'
import { useHoldingDetailScreen } from './hooks/useHoldingDetailScreen'

export const HoldingDetailScreen = () => {
  const detail = useHoldingDetailScreen()

  if (detail.error && !detail.holding) {
    return (
      <Screen>
        <ErrorState error={detail.error} onRetry={detail.retry} />
      </Screen>
    )
  }

  if (!detail.holding) {
    return (
      <Screen>
        <Card>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-32 w-full' />
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: detail.holding.name }} />
      <Card>
        {detail.facts.map(fact => (
          <ListRow
            key={fact.label}
            title={fact.label}
            right={
              <Text variant='label' tone='ink'>
                {fact.value}
              </Text>
            }
          />
        ))}
      </Card>
      <Card title='About this fund'>
        <Text tone='muted'>{detail.holding.about}</Text>
      </Card>
    </Screen>
  )
}

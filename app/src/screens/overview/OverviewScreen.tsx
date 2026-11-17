import { Card, Screen, Skeleton, Text } from '@/components/atoms'
import { ErrorState } from '@/components/molecules'
import { CashAccountsCard } from './components/CashAccountsCard'
import { TransfersInProgressCard } from './components/TransfersInProgressCard'
import { ValueCard } from './components/ValueCard'
import { useOverviewScreen } from './hooks/useOverviewScreen'

export const OverviewScreen = () => {
  const overview = useOverviewScreen()

  if (overview.isLoading) {
    return (
      <Screen>
        <Skeleton className='h-6 w-40' />
        {[0, 1, 2].map(key => (
          <Card key={key}>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-full' />
          </Card>
        ))}
      </Screen>
    )
  }

  if (overview.error) {
    return (
      <Screen>
        <ErrorState error={overview.error} onRetry={overview.retry} />
      </Screen>
    )
  }

  return (
    <Screen refreshing={overview.refreshing} onRefresh={overview.refresh}>
      <Text variant='heading'>Hello, {overview.firstName}</Text>
      <Text variant='caption'>Plan {overview.planNumber}</Text>
      <ValueCard {...overview} />
      <CashAccountsCard {...overview} />
      <TransfersInProgressCard {...overview} />
    </Screen>
  )
}

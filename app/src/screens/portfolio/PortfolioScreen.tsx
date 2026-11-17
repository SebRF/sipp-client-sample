import { Card, Screen, Skeleton } from '@/components/atoms'
import { EmptyState, ErrorState } from '@/components/molecules'
import { HoldingRow } from './components/HoldingRow'
import { usePortfolioScreen } from './hooks/usePortfolioScreen'

export const PortfolioScreen = () => {
  const portfolio = usePortfolioScreen()

  if (portfolio.isLoading) {
    return (
      <Screen>
        <Card>
          {[0, 1, 2, 3].map(key => (
            <Skeleton key={key} className='h-10 w-full' />
          ))}
        </Card>
      </Screen>
    )
  }

  if (portfolio.error) {
    return (
      <Screen>
        <ErrorState error={portfolio.error} onRetry={portfolio.retry} />
      </Screen>
    )
  }

  return (
    <Screen refreshing={portfolio.refreshing} onRefresh={portfolio.refresh}>
      {portfolio.holdings.length ? (
        <Card title='Holdings'>
          {portfolio.holdings.map(holding => (
            <HoldingRow
              key={holding.id}
              holding={holding}
              onPress={() => portfolio.onOpenHolding(holding.id)}
            />
          ))}
        </Card>
      ) : (
        <EmptyState message='You have no investments yet.' />
      )}
    </Screen>
  )
}

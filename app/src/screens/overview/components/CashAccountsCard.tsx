import { View } from 'react-native'
import { Button, Card, Text } from '@/components/atoms'
import { ListRow, Money, StatusChip } from '@/components/molecules'
import type { useOverviewScreen } from '../hooks/useOverviewScreen'

type CashAccountsCardProps = Pick<
  ReturnType<typeof useOverviewScreen>,
  'cashAccounts' | 'recentMoves' | 'onMoveCash'
>

export const CashAccountsCard = ({
  cashAccounts,
  recentMoves,
  onMoveCash
}: CashAccountsCardProps) => (
  <Card title='Cash accounts'>
    {cashAccounts.map(account => (
      <ListRow
        key={account.id}
        title={`${account.currency} account`}
        right={
          <Money
            variant='label'
            tone='ink'
            amount={account.balance}
            currency={account.currency}
          />
        }
      />
    ))}
    <Button label='Move cash' onPress={onMoveCash} />
    {recentMoves.length ? (
      <View className='gap-2 border-t border-line pt-3'>
        <Text variant='label'>Recent moves</Text>
        {recentMoves.map(move => (
          <View
            key={move.id}
            className='flex-row items-center justify-between gap-2'
          >
            <Text variant='caption' tone='ink' className='flex-1'>
              {move.label}
            </Text>
            <StatusChip
              label={move.pending ? 'Pending' : 'Settled'}
              tone={move.pending ? 'pending' : 'positive'}
            />
          </View>
        ))}
      </View>
    ) : null}
  </Card>
)

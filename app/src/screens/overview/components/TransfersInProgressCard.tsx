import { Card, Text } from '@/components/atoms'
import { ListRow, StatusChip } from '@/components/molecules'
import { formatMoney } from '@/utils/money'
import type { useOverviewScreen } from '../hooks/useOverviewScreen'

type TransfersInProgressCardProps = Pick<
  ReturnType<typeof useOverviewScreen>,
  'transfersInProgress' | 'onOpenTransfers'
>

export const TransfersInProgressCard = ({
  transfersInProgress,
  onOpenTransfers
}: TransfersInProgressCardProps) => (
  <Card title='Transfers in progress'>
    {transfersInProgress.length ? (
      transfersInProgress.map(transfer => (
        <ListRow
          key={transfer.id}
          title={transfer.cedingScheme}
          subtitle={formatMoney(transfer.amount, transfer.currency)}
          right={<StatusChip label={transfer.stageLabel} tone='neutral' />}
          onPress={onOpenTransfers}
        />
      ))
    ) : (
      <Text tone='muted'>No transfers in progress.</Text>
    )}
  </Card>
)

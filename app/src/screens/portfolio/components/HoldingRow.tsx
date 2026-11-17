import { View } from 'react-native'
import { Text } from '@/components/atoms'
import { ListRow, Money } from '@/components/molecules'
import type { Holding } from '@/data/types'
import { formatPct } from '@/utils/money'

type HoldingRowProps = { holding: Holding; onPress: () => void }

export const HoldingRow = ({ holding, onPress }: HoldingRowProps) => (
  <ListRow
    title={holding.name}
    subtitle={`${holding.allocationPct}% of investments`}
    onPress={onPress}
    right={
      <View className='items-end'>
        <Money
          variant='label'
          tone='ink'
          amount={holding.value}
          currency={holding.currency}
        />
        <Text
          variant='caption'
          tone={holding.dayChangePct >= 0 ? 'positive' : 'negative'}
        >
          {formatPct(holding.dayChangePct)}
        </Text>
      </View>
    }
  />
)

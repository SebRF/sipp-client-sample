import { View } from 'react-native'
import { Card, Text } from '@/components/atoms'
import { CurrencyToggle, Money } from '@/components/molecules'
import type { useOverviewScreen } from '../hooks/useOverviewScreen'

type ValueCardProps = Pick<
  ReturnType<typeof useOverviewScreen>,
  'totals' | 'displayCurrency' | 'setDisplayCurrency'
>

export const ValueCard = ({
  totals,
  displayCurrency,
  setDisplayCurrency
}: ValueCardProps) => (
  <Card>
    <Text variant='label'>Total plan value</Text>
    {totals ? (
      <>
        <Money
          variant='title'
          amount={totals.total}
          currency={displayCurrency}
        />
        <View className='flex-row gap-6'>
          <View>
            <Text variant='caption'>Investments</Text>
            <Money
              variant='label'
              tone='ink'
              amount={totals.investments}
              currency={displayCurrency}
            />
          </View>
          <View>
            <Text variant='caption'>Cash</Text>
            <Money
              variant='label'
              tone='ink'
              amount={totals.cash}
              currency={displayCurrency}
            />
          </View>
        </View>
      </>
    ) : null}
    <CurrencyToggle value={displayCurrency} onChange={setDisplayCurrency} />
    <Text variant='caption'>Converted at indicative rates.</Text>
  </Card>
)

import { View } from 'react-native'
import {
  Button,
  Card,
  Screen,
  Skeleton,
  Text,
  TextInput
} from '@/components/atoms'
import { CurrencyToggle } from '@/components/molecules'
import { useMoveCashScreen } from './hooks/useMoveCashScreen'

export const MoveCashScreen = () => {
  const moveCash = useMoveCashScreen()

  if (moveCash.isLoading) {
    return (
      <Screen>
        <Skeleton className='h-48 w-full' />
      </Screen>
    )
  }

  return (
    <Screen>
      <Card>
        <Text variant='label'>From</Text>
        <CurrencyToggle
          value={moveCash.fromCurrency}
          onChange={moveCash.setFromCurrency}
        />
        <Text variant='caption'>Available {moveCash.available}</Text>

        <Text variant='label'>To</Text>
        <CurrencyToggle
          value={moveCash.toCurrency}
          onChange={moveCash.setToCurrency}
        />

        <Text variant='label'>Amount ({moveCash.fromCurrency})</Text>
        <TextInput
          accessibilityLabel='Amount'
          keyboardType='decimal-pad'
          placeholder='0.00'
          value={moveCash.amountText}
          onChangeText={moveCash.setAmountText}
          invalid={!!moveCash.error}
        />
        <View className='min-h-5'>
          {moveCash.error ? (
            <Text variant='caption' tone='negative'>
              {moveCash.error}
            </Text>
          ) : moveCash.preview ? (
            <Text variant='caption'>{moveCash.preview}</Text>
          ) : null}
        </View>
      </Card>

      <Text variant='caption'>
        Moves show as pending until settled. Rates are indicative.
      </Text>
      <Button
        label='Move cash'
        onPress={moveCash.submit}
        loading={moveCash.isSubmitting}
      />
    </Screen>
  )
}

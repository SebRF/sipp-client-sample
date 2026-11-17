import { View } from 'react-native'
import { Pressable, Text } from '@/components/atoms'
import { currencies, type Currency } from '@/data/types'

type CurrencyToggleProps = {
  value: Currency
  onChange: (currency: Currency) => void
}

export const CurrencyToggle = ({ value, onChange }: CurrencyToggleProps) => (
  <View className='flex-row rounded-xl bg-canvas p-1'>
    {currencies.map(currency => {
      const selected = currency === value
      return (
        <Pressable
          key={currency}
          accessibilityRole='button'
          accessibilityState={{ selected }}
          onPress={() => onChange(currency)}
          className={`flex-1 items-center rounded-lg py-1.5 ${
            selected ? 'bg-surface' : ''
          }`}
        >
          <Text variant='label' tone={selected ? 'brand' : 'muted'}>
            {currency}
          </Text>
        </Pressable>
      )
    })}
  </View>
)

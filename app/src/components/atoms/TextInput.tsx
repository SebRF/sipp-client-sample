import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps
} from 'react-native'
import colors from '@/theme/colors.json'

type TextInputProps = RNTextInputProps & { invalid?: boolean }

export const TextInput = ({ invalid = false, ...props }: TextInputProps) => (
  <RNTextInput
    placeholderTextColor={colors.placeholder}
    className={`h-12 rounded-xl border bg-surface px-4 text-base text-ink ${
      invalid ? 'border-negative' : 'border-line'
    }`}
    {...props}
  />
)

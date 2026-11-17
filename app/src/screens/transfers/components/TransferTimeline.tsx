import { View } from 'react-native'
import { Text } from '@/components/atoms'
import type { TimelineStep } from '../helpers/toTimeline'

const dotClass = {
  done: 'bg-positive border-positive',
  current: 'bg-surface border-brand border-2',
  upcoming: 'bg-surface border-line'
}

export const TransferTimeline = ({ steps }: { steps: TimelineStep[] }) => (
  <View>
    {steps.map((step, index) => (
      <View key={step.key} className='flex-row gap-3'>
        <View className='items-center'>
          <View
            className={`h-3.5 w-3.5 rounded-full border ${dotClass[step.state]}`}
          />
          {index < steps.length - 1 ? (
            <View
              className={`w-0.5 flex-1 ${step.state === 'done' ? 'bg-positive' : 'bg-line'}`}
            />
          ) : null}
        </View>
        <View className='flex-1 pb-4'>
          <Text
            variant='label'
            tone={step.state === 'upcoming' ? 'muted' : 'ink'}
          >
            {step.label}
          </Text>
          <Text variant='caption'>
            {step.date ??
              (step.state === 'current' ? 'In progress' : 'Not started')}
          </Text>
        </View>
      </View>
    ))}
  </View>
)

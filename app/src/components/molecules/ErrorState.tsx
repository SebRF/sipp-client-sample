import { Button, Card, Text } from '@/components/atoms'

type ErrorStateProps = { error: Error | null; onRetry: () => void }

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <Card className='items-center py-8'>
    <Text variant='heading'>Something went wrong</Text>
    <Text tone='muted' className='text-center'>
      {error?.message ?? 'Please try again.'}
    </Text>
    <Button label='Try again' variant='secondary' onPress={onRetry} />
  </Card>
)

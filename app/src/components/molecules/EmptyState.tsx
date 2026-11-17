import { Card, Text } from '@/components/atoms'

export const EmptyState = ({ message }: { message: string }) => (
  <Card className='items-center py-8'>
    <Text tone='muted'>{message}</Text>
  </Card>
)

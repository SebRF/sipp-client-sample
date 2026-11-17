import '../../global.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { queryClient } from '@/data/queryClient'
import colors from '@/theme/colors.json'

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <Stack
      screenOptions={{
        headerTintColor: colors.brand.DEFAULT,
        headerBackButtonDisplayMode: 'minimal',
        headerTitleStyle: { color: colors.ink },
        contentStyle: { backgroundColor: colors.canvas }
      }}
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='holdings/[id]' options={{ title: 'Holding' }} />
      <Stack.Screen
        name='move-cash'
        options={{ presentation: 'modal', title: 'Move cash' }}
      />
    </Stack>
    <StatusBar style='dark' />
  </QueryClientProvider>
)

export default RootLayout

import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import type { ComponentProps } from 'react'
import type { ColorValue } from 'react-native'
import colors from '@/theme/colors.json'

type IconName = ComponentProps<typeof Ionicons>['name']

type TabIconProps = { name: IconName; color: ColorValue; size: number }

const TabIcon = ({ name, color, size }: TabIconProps) => (
  <Ionicons name={name} color={color as string} size={size} />
)

const TabsLayout = () => (
  <Tabs
    screenOptions={{
      tabBarActiveTintColor: colors.brand.DEFAULT,
      tabBarInactiveTintColor: colors.muted,
      headerTitleStyle: { color: colors.ink }
    }}
  >
    <Tabs.Screen
      name='index'
      options={{
        title: 'Overview',
        tabBarIcon: props => <TabIcon name='pie-chart-outline' {...props} />
      }}
    />
    <Tabs.Screen
      name='portfolio'
      options={{
        title: 'Portfolio',
        tabBarIcon: props => <TabIcon name='briefcase-outline' {...props} />
      }}
    />
    <Tabs.Screen
      name='transfers'
      options={{
        title: 'Transfers',
        tabBarIcon: props => (
          <TabIcon name='swap-horizontal-outline' {...props} />
        )
      }}
    />
  </Tabs>
)

export default TabsLayout

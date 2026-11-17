import { useState } from 'react'

export const useRefresh = (reload: () => Promise<unknown>) => {
  const [refreshing, setRefreshing] = useState(false)

  const refresh = async () => {
    setRefreshing(true)
    try {
      await reload()
    } finally {
      setRefreshing(false)
    }
  }

  return { refreshing, refresh }
}

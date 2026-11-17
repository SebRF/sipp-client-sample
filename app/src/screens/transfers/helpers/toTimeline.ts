import type { Transfer } from '@/data/types'
import { formatDate } from '@/utils/dates'

export type TimelineStep = {
  key: string
  label: string
  date: string | null
  state: 'done' | 'current' | 'upcoming'
}

export const toTimeline = ({ stages }: Transfer): TimelineStep[] => {
  const currentIndex = stages.findIndex(stage => !stage.at)

  return stages.map((stage, index) => ({
    key: stage.key,
    label: stage.label,
    date: stage.at ? formatDate(stage.at) : null,
    state: stage.at ? 'done' : index === currentIndex ? 'current' : 'upcoming'
  }))
}

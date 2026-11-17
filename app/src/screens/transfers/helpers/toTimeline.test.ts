import type { Transfer } from '@/data/types'
import { toTimeline } from './toTimeline'

const transfer = (dates: (string | undefined)[]): Transfer => ({
  id: 't',
  cedingScheme: 'Scheme',
  amount: 1,
  currency: 'GBP',
  stage: 'requested',
  stages: (['requested', 'contacted', 'received', 'invested'] as const).map(
    (key, index) => ({ key, label: key, at: dates[index] })
  )
})

const states = (t: Transfer) => toTimeline(t).map(step => step.state)

describe('toTimeline', () => {
  it('marks dated stages done and the next one current', () => {
    expect(states(transfer(['2026-10-02', '2026-10-06']))).toEqual([
      'done',
      'done',
      'current',
      'upcoming'
    ])
  })

  it('has no current stage once every stage is dated', () => {
    const dates = ['2026-06-11', '2026-06-15', '2026-07-22', '2026-07-24']
    expect(states(transfer(dates))).toEqual(['done', 'done', 'done', 'done'])
    expect(toTimeline(transfer(dates))[3].date).toBe('24 Jul 2026')
  })
})

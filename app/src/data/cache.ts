export enum Intervals {
  THREE_SEC = 3_000,
  THIRTY_SEC = 30_000,
  ONE_HOUR = 3_600_000
}

export const cachePresets = {
  standard: { staleTime: Intervals.THIRTY_SEC },
  reference: { staleTime: Intervals.ONE_HOUR }
}

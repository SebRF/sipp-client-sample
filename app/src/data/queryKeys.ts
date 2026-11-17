export const queryKeys = {
  fxRates: () => ['fxRates'] as const,
  client: (clientId: string) => ['client', clientId] as const,
  cashAccounts: (clientId: string) => ['cashAccounts', clientId] as const,
  cashMoves: (clientId: string) => ['cashMoves', clientId] as const,
  transfers: (clientId: string) => ['transfers', clientId] as const,
  holdings: {
    all: (clientId: string) => ['holdings', clientId] as const,
    detail: (clientId: string, id: string) =>
      ['holdings', clientId, id] as const
  }
}

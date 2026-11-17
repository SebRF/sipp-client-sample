import express from 'express'
import { createStore } from './store.ts'

const PORT = Number(process.env.PORT ?? 4000)
const DEMO_TOKEN = process.env.DEMO_TOKEN ?? 'demo-token'
const SETTLE_MS = Number(process.env.SETTLE_MS ?? 8000)

const store = createStore()
const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  })
  if (req.method === 'OPTIONS') return void res.sendStatus(204)
  next()
})

app.use((_req, _res, next) => {
  setTimeout(next, 300 + Math.random() * 300)
})

app.use('/v1', (req, res, next) => {
  if (req.get('Authorization') !== `Bearer ${DEMO_TOKEN}`) {
    return void res.status(401).json({ error: 'Not signed in' })
  }
  next()
})

app.get('/v1/client', (_req, res) => void res.json(store.client))
app.get('/v1/fx-rates', (_req, res) => void res.json(store.fxRates))
app.get('/v1/cash-accounts', (_req, res) => void res.json(store.cashAccounts))
app.get('/v1/holdings', (_req, res) => void res.json(store.holdings))
app.get('/v1/transfers', (_req, res) => void res.json(store.transfers))
app.get('/v1/cash-moves', (_req, res) => void res.json(store.cashMoves))

app.get('/v1/holdings/:id', (req, res) => {
  const holding = store.holdings.find(h => h.id === req.params.id)
  if (!holding) return void res.status(404).json({ error: 'Holding not found' })
  res.json(holding)
})

app.post('/v1/cash-moves', (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body ?? {}
  const result = store.applyCashMove({
    fromAccountId: String(fromAccountId),
    toAccountId: String(toAccountId),
    amount: Number(amount)
  })
  if (!result.ok) return void res.status(422).json({ error: result.error })

  setTimeout(() => store.settleCashMove(result.move.id), SETTLE_MS)
  res.status(201).json(result.move)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API on http://localhost:${PORT}/v1 (token: ${DEMO_TOKEN})`)
})

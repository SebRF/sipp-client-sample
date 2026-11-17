import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createStore } from './store.ts'

const balance = (store: ReturnType<typeof createStore>, id: string) =>
  store.cashAccounts.find(a => a.id === id)?.balance

test('moves cash across currencies at the fixed rate', () => {
  const store = createStore()
  const result = store.applyCashMove({
    fromAccountId: 'acc_gbp',
    toAccountId: 'acc_eur',
    amount: 100
  })

  assert.ok(result.ok)
  assert.equal(result.move.rate, 1.17)
  assert.equal(result.move.toAmount, 117)
  assert.equal(result.move.status, 'pending')
  assert.equal(balance(store, 'acc_gbp'), 8150)
  assert.equal(balance(store, 'acc_eur'), 4237.5)
  assert.equal(store.cashMoves[0].id, result.move.id)
})

test('rounds conversions down so round trips cannot make money', () => {
  const store = createStore()
  const there = store.applyCashMove({
    fromAccountId: 'acc_eur',
    toAccountId: 'acc_aud',
    amount: 10
  })
  assert.ok(there.ok)
  assert.equal(there.move.toAmount, 16.49)

  const tooSmall = store.applyCashMove({
    fromAccountId: 'acc_aud',
    toAccountId: 'acc_gbp',
    amount: 0.01
  })
  assert.deepEqual(tooSmall, { ok: false, error: 'Amount too small to convert' })
})

test('settles a pending move', () => {
  const store = createStore()
  const result = store.applyCashMove({
    fromAccountId: 'acc_usd',
    toAccountId: 'acc_gbp',
    amount: 50
  })
  assert.ok(result.ok)

  store.settleCashMove(result.move.id)
  assert.equal(store.cashMoves[0].status, 'settled')
})

test('rejects invalid moves and leaves balances alone', () => {
  const store = createStore()
  const cases = [
    { fromAccountId: 'acc_gbp', toAccountId: 'acc_gbp', amount: 10 },
    { fromAccountId: 'acc_gbp', toAccountId: 'acc_eur', amount: 0 },
    { fromAccountId: 'acc_gbp', toAccountId: 'acc_eur', amount: 1.234 },
    { fromAccountId: 'acc_aud', toAccountId: 'acc_gbp', amount: 951 },
    { fromAccountId: 'acc_xxx', toAccountId: 'acc_gbp', amount: 1 }
  ]

  for (const input of cases) {
    assert.equal(store.applyCashMove(input).ok, false)
  }
  assert.equal(balance(store, 'acc_gbp'), 8250)
  assert.equal(balance(store, 'acc_aud'), 950)
  assert.equal(store.cashMoves.length, 1)
})

test('each store starts from the seed', () => {
  const first = createStore()
  first.applyCashMove({ fromAccountId: 'acc_gbp', toAccountId: 'acc_eur', amount: 1 })

  assert.equal(balance(createStore(), 'acc_gbp'), 8250)
})

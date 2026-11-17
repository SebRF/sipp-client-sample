# How I build

This is a small Expo app I put together to show how I structure a client app on top of an existing REST API. Everything in it is sample data. This is the short version of why it looks the way it does.

## Screens and components

I keep a thin layer of my own between the libraries and the screens. Colours live in one tokens file (`theme/colors.json`), and `Text`, `Pressable` and `TextInput` only come from `components/atoms`.

On my last app at The AA we built our own atoms, molecules and organisms library on NativeWind, with the design system as a Tailwind preset (colours, typography and variants). For anything complex like selects, dialogs or bottom sheets, I'd use something like React Native Reusables or a focused library rather than build it, and keep it behind the atoms the same way. If the current website already has a design system, the app should share its tokens.

Each screen has a `useXScreen` hook that gives it everything it renders and every handler it calls, so the screen component just renders. That hook is built from smaller ones split by what they do (data, refresh, form state) rather than one big file, which makes it much easier to review, read and debug. If a function doesn't touch React state it's not a hook, it goes in `helpers/` as a plain function, so totals, validation and the transfer timeline get tested without rendering anything.

Loading, error and empty states get built with the screen, not after someone hits them.

In the proper app all copy would go through i18next from the start, with a parser pulling the keys out of the code. Clients are spread across countries, and adding it later means touching every screen. I've left it out here to keep it small. Money and dates already go through `Intl`, so they'd just need the locale passed in. That makes adding languages later a small job.

## Data

React Query owns anything that comes from the API. Zustand is for state that only lives in the app, here the session and the display currency. The currency is persisted, the token isn't, as that would go in the keychain. I don't copy API data into a store, as that's usually where stale data bugs come from.

I've been caught by this on a dashboard editor. We synced query data into a Zustand store with a `useEffect`. Applying a template invalidated the queries, but edit mode took its snapshot from the store before it had caught up, so it was working off the old data.

All query keys come from one file (`data/queryKeys.ts`). They start with the resource and then carry whatever scopes the result, so cash accounts are `['cashAccounts', clientId]` and a holding is `['holdings', clientId, id]`. Invalidating `['holdings', clientId]` then refreshes the list and every holding for that client, and nothing for anyone else. Because the client ID is always second in the key, one predicate can also invalidate everything for a client, for example on sign-out.

Cache times use one `Intervals` enum and a couple of named presets: `standard` as the default, and `reference` for things like FX rates that barely change. A query only sets a preset when it's different from the default, so there are no millisecond numbers spread across files. I've found a few presets cover most cases and keep everything consistent.

If there's already data to show, the next screen uses it as `placeholderData`. Tapping a holding opens the detail screen straight away with the row from the list, then fills in the rest when the request comes back, so there's no loading skeleton flashing up on every tap.

Invalidation only covers what actually changed. Moving cash invalidates the client's cash accounts and cash moves, nothing else. Pull to refresh on the overview invalidates the client's data but leaves the FX rates alone.

Moving money shows as pending straight away, never as done. The cache is updated before the request goes out, it rolls back if the server refuses, and the moves list polls every few seconds only while something's pending, until the server says it's settled.

I learned the hard way that numbers have to come from one place. On a finance platform, account values on one screen were summed from raw ledger rows while the reports used the aggregated ones, so they didn't match and some came out with the wrong sign. The fix was to work them out with the same function the reports use. Here that means the server's figures always win: the pending balances are only a preview, and they get replaced by what the server sends back. Conversions round down on both sides, so moving money back and forth can never create any.

## Tests

Tests go where things break: the money maths, validation, the transfer timeline, the optimistic update and its rollback, and the server's rules. I don't snapshot test layouts, as those are easier to check by eye. CI runs typecheck, lint and tests on every push.

## In short

- A thin UI layer of my own, sharing the design system's tokens.
- Screens only render. Logic lives in small hooks, and pure logic in plain helpers.
- React Query for API data, Zustand only for app state, and never the two mixed.
- Scoped query keys, named cache presets, and invalidating only what changed.
- Money stays pending until the server confirms it, and the server's numbers win.
- Keep it boring: no abstraction with one caller, readable top to bottom first time.

That's how I'd start the real app too: read-only screens on this structure first, then transactions using the same pending pattern.

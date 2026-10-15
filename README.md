# CacheLab — LRU + TTL Visualizer

An interactive, dependency-free JavaScript LRU Cache debugger.

## Open locally

Double-click **`index.html`** in a browser. All HTML, CSS and JavaScript are in one file. No installation, internet connection, server or build tooling is needed.

## Publish with GitHub Pages

1. Create a public GitHub repository (for example `lru-cache-visualizer`).
2. Upload `index.html` to the repository's root directory and commit it.
3. Open **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch** → `main` → `/ (root)` → **Save**.
5. Once deployed, the site URL will usually be `https://<your-username>.github.io/lru-cache-visualizer/`.

## Features

- Manual `GET` and `PUT`, numeric or string keys, custom values.
- Simulated `let now` clock with direct input, +25ms/+100ms and next-expiry buttons.
- LRU-to-MRU queue animation, expiry status and capacity usage.
- Step-by-step snapshots with highlighted JavaScript code and detailed explanations.
- Previous / Next / Auto / End / timeline scrubber.
- LRU eviction, TTL expiration, and TTL refresh sample scenarios.
- Configurable cache capacity and TTL, operation history and hit/eviction counters.

## Key behaviors

- `get(key)` returns the **underlying value** or `-1` on a cache miss.
- `get(key)` deletes an expired entry only if that specific key is requested.
- Successful `get(key)` moves that entry to the MRU position **without refreshing its TTL**.
- `put(key, value)` refreshes the entry's expiration and MRU position.
- When the cache is full, `put` removes expired entries first, then evicts LRU only if still full.
- Advancing the clock alone **does not delete** expired entries; cleanup is lazy.
- An operation's snapshots are calculated on a clone. The final state is committed when the walkthrough reaches the last step. **Cancel before the last step** discards it. Previous/Rewind after commit is a visual replay only; it does not undo a committed operation.
- Values are read as text. The key-type dropdown distinguishes numeric key `1` from string key `"1"`.
- Capacity settings are applied by resetting the cache; existing entries cannot be silently carried into a new capacity configuration.

## Sample sequence

With capacity 2, TTL 100ms and current time 0:

```js
cache.put(1, 'A'); // [1]
cache.put(2, 'B'); // [1, 2]
cache.get(1);      // [2, 1]
cache.put(3, 'C'); // [1, 3] (2 evicted)
// at now = 101
cache.get(1);      // -1, 1 deleted as expired
```

## Implementation

`LRUCache` is implemented in vanilla JavaScript using `Map`. The UI generates walkthrough steps from a cloned instance using the **same** `get` and `put` methods as execution, so code branches and queue snapshots remain consistent. The app does not use any CDN, third-party dependency, external font, or analytics service.
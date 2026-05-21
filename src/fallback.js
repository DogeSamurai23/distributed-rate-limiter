const store = new Map();

function fallbackCheck(key, config) {
  const now = Date.now() / 1000;

  let bucket = store.get(key);

  if (!bucket) {
    bucket = {
      tokens: config.capacity,
      lastRefill: now,
    };
  }

  const delta = now - bucket.lastRefill;

  bucket.tokens = Math.min(
    config.capacity,
    bucket.tokens + delta * config.refillRate
  );

  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    store.set(key, bucket);
    return true;
  }

  store.set(key, bucket);
  return false;
}

module.exports = { fallbackCheck };
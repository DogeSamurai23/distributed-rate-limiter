const redis = require("./redis");
const luaScript = require("./lua");

async function isAllowed(key, config) {
  const now = Date.now() / 1000;

  const result = await redis.eval(
    luaScript,
    1,
    key,
    config.capacity,
    config.refillRate,
    now
  );

  return result === 1;
}

module.exports = { isAllowed };
module.exports = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call("HMGET", key, "tokens", "timestamp")

local tokens = tonumber(data[1]) or capacity
local last = tonumber(data[2]) or now

local delta = math.max(0, now - last)
local refill = delta * refill_rate
tokens = math.min(capacity, tokens + refill)

local allowed = tokens >= 1
if allowed then
  tokens = tokens - 1
end

redis.call("HMSET", key, "tokens", tokens, "timestamp", now)
redis.call("EXPIRE", key, 60)

return allowed and 1 or 0
`;
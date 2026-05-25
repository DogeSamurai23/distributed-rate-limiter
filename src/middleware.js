const { isAllowed } = require("./limiter");
const { fallbackCheck } = require("./fallback");

function rateLimiter(config) {
  return async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
      console.log("400");
      return res.status(400).send("User ID required");
    }

    const key = `rate_limit:user:${userId}`;

    try {
      const allowed = await isAllowed(key, config);

      if (!allowed) {
        console.log("429-redis");
        return res.status(429).send("Too Many Requests");
      }
    } catch (err) {
      const allowed = fallbackCheck(key, config);

      if (!allowed) {
        console.log("429-fallback");
        return res.status(429).send("Too Many Requests");
      }
    }

    console.log("200");
    next();
  };
}

module.exports = rateLimiter;
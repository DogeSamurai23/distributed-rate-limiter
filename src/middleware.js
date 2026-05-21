const { isAllowed } = require("./limiter");
const { fallbackCheck } = require("./fallback");
const localStore = new Map();

function localReject(key){
  const now =Date.now();

  let data = localStore.get(key)

  if(!data){
    data={count:0, last:now};
  }
  if (now-data.last<1000){
    data.count+=1;
  } else{
    data.count=1;
    data.last=now;
  }

  localStore.set(key,data);
  return data.count>10;
}

function rateLimiter(config) {
  return async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
    return res.status(400).send("User ID required");
    }

    const key = `rate_limit:user:${userId}`;

    if (localReject(key)){
      return res.status(429).send("Too many requests, please try again in sometime.")
    }

    try {
      const allowed = await isAllowed(key, config);

      if (!allowed) {
        return res.status(429).send("Too Many Requests");
      }
    } catch (err) {
      const allowed = fallbackCheck(key, config);

      if (!allowed) {
        return res.status(429).send("Too Many Requests");
      }
    }

    console.log(req.params);

    next();
  };
}

module.exports = rateLimiter;
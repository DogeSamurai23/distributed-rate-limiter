# Distributed Rate Limiter

A distributed rate limiting system built using Node.js, Redis, and Lua scripting.  
Implements the Token Bucket algorithm with atomic operations to ensure consistency under concurrent access.

---

## Overview

This system enforces request limits across multiple application instances by maintaining shared state in Redis. It is designed to be horizontally scalable, fault-tolerant, and safe under high concurrency.

---

## Architecture

Client → Express Server → Rate Limiter Middleware → Redis (Lua Script)

  ↓

In-Memory Fallback


---

## Key Features

- Distributed rate limiting across multiple servers  
- Token Bucket algorithm (burst + sustained traffic control)  
- Atomic updates using Redis Lua scripting  
- In-memory fallback for failure scenarios  
- Per-user rate limiting via URL parameters  
- Stateless server design for horizontal scalability  

---

## Technology Stack

- Node.js  
- Express.js  
- Redis  
- Lua  

---

## Rate Limiting Strategy

The system uses the Token Bucket algorithm to control request flow.

Each user is assigned a bucket defined by:

- **Capacity**: Maximum number of tokens (burst limit)  
- **Refill Rate**: Tokens added per second  

On each request:

tokens = min(capacity, tokens + (currentTime - lastRefill) * refillRate)

if tokens >= 1:
allow request
tokens -= 1

else:
reject request (HTTP 429)


---

## Atomicity and Concurrency Control

To prevent race conditions in a distributed environment, all token updates are executed using a Redis Lua script.

This ensures:

- Atomic read-modify-write operations  
- No double consumption of tokens  
- Consistent state across concurrent requests  

---

## API
### Endpoint
GET /user/:userId
### Example 
curl http://localhost:3000/user/123

---

## Configuration

Example:

```js
capacity: 10,
refillRate: 1 / 10
```

## Setup and Execution

1. Start Redis (Docker)
docker run -d --name redis-server -p 6379:6379 redis
2. Install dependencies
npm install
3. Start application
npm start
4. Test endpoint
curl http://localhost:3000/user/123

## Fault Tolerance

### If Redis becomes unavailable:

The system falls back to an in-memory rate limiter
Ensures continued availability
Accepts reduced consistency as a trade-off
Key Design
rate_limit:user:<userId>

Ensures complete isolation between users.

## Limitations

- In-memory fallback is not distributed
- No persistence of rate limit state
- No built-in monitoring or metrics

## Future Enhancements
- Rate limit response headers (X-RateLimit-*)
- Per-route and per-tier rate limiting
- Redis clustering support
- Observability (metrics and logging)
- Alternative algorithms (sliding window)

## Concepts Demonstrated
- Distributed systems design

- Token Bucket algorithm

- Atomic operations and concurrency control

- Fault tolerance and graceful degradation

## Author
Aditya


---



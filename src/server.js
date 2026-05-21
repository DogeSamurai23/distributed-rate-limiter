const express = require("express");
const rateLimiter = require("./middleware");

const app = express();

app.get(
  "/user/:userId",
  rateLimiter({
    capacity: 10,
    refillRate: 1 / 10
  }),
  (req, res) => {
    res.send("OK");
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
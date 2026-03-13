const express = require("express");
const app = express();
app.use(express.json());

// ── Task 5: Request Time Middleware ──────────────────────────
function addRequestTime(req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
}

app.use(addRequestTime); // Apply globally — stamps every request

// GET /request-time — Show when this request arrived
app.get("/request-time", (req, res) => {
  res.send(`This request was received at: ${req.requestTime}`);
});

// Extra routes to show requestTime is available everywhere
app.get("/ping", (req, res) => {
  res.json({ message: "pong", receivedAt: req.requestTime });
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Task 5 running on http://localhost:${PORT}`));

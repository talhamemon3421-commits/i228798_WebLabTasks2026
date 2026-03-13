const express = require("express");
const app = express();
app.use(express.json());

// ── Task 3: Request Counter ──────────────────────────────────
let requestCount = 0;

function countRequests(req, res, next) {
  requestCount++;
  next();
}

app.use(countRequests); // Apply globally — counts every incoming request

// GET /stats — View total request count
app.get("/stats", (req, res) => {
  res.send(`Total API Requests: ${requestCount}`);
});

// Extra routes to help demonstrate the counter going up
app.get("/ping", (req, res) => res.send("pong"));
app.get("/hello", (req, res) => res.send("Hello World!"));

const PORT = 3003;
app.listen(PORT, () => console.log(`Task 3 running on http://localhost:${PORT}`));

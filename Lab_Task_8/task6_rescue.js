const express = require("express");
const app = express();
app.use(express.json());

// ── Middleware 1: Animal Type Check ───────────────────────────
function animalTypeCheck(req, res, next) {
  const validTypes = ["bird", "mammal", "reptile"];
  const { animalType } = req.body;

  if (!animalType) {
    return res.status(400).json({ error: "animalType is required" });
  }

  const type = animalType.toLowerCase();
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: `Unknown animal type "${animalType}". Valid types: bird, mammal, reptile`,
    });
  }

  // Attach rescue strategy based on animal type
  if (type === "bird") {
    req.rescueStrategy = "Use gentle netting; avoid loud noises";
  } else if (type === "mammal") {
    req.rescueStrategy = "Approach cautiously; use tranquilisers if needed";
  } else {
    req.rescueStrategy = "Use protective gloves; keep temperature stable";
  }

  next();
}

// ── Middleware 2: Severity Level Check ────────────────────────
function severityCheck(req, res, next) {
  const validLevels = ["mild", "moderate", "severe"];
  const { severity } = req.body;

  if (!severity) {
    return res.status(400).json({ error: "severity is required" });
  }

  const level = severity.toLowerCase();
  if (!validLevels.includes(level)) {
    return res.status(400).json({
      error: `Unknown severity "${severity}". Valid levels: mild, moderate, severe`,
    });
  }

  // Higher severity = more resources needed
  req.resourceMultiplier = level === "mild" ? 1 : level === "moderate" ? 2 : 3;
  next();
}

// ── Middleware 3: Resource Availability Check ─────────────────
function resourceCheck(req, res, next) {
  // Simulated available resource pool
  const available = { teamMembers: 5, vehicles: 2, equipment: 3 };

  const required = {
    teamMembers: req.resourceMultiplier * 1,
    vehicles:    req.resourceMultiplier * 1,
    equipment:   req.resourceMultiplier * 1,
  };

  req.resourceSufficient =
    available.teamMembers >= required.teamMembers &&
    available.vehicles    >= required.vehicles    &&
    available.equipment   >= required.equipment;

  next();
}

// ── Middleware 4: Mission Outcome Determination ───────────────
function missionOutcome(req, res, next) {
  const severity = req.body.severity.toLowerCase();

  if (!req.resourceSufficient) {
    req.outcome = "delayed – insufficient resources";
  } else if (severity === "severe") {
    req.outcome = "success with high difficulty";
  } else {
    req.outcome = "success";
  }

  next();
}

// ── Middleware 5: Error Handler ───────────────────────────────
function rescueErrorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "An unexpected error occurred during the rescue mission" });
}

// POST /rescue-mission — all middleware runs in order
app.post(
  "/rescue-mission",
  animalTypeCheck,
  severityCheck,
  resourceCheck,
  missionOutcome,
  (req, res) => {
    res.json({
      message:  "Rescue mission processed",
      outcome:  req.outcome,
      strategy: req.rescueStrategy,
    });
  }
);

app.use(rescueErrorHandler); // Global error handler must come last

const PORT = 3006;
app.listen(PORT, () => console.log(`Task 6 running on http://localhost:${PORT}`));

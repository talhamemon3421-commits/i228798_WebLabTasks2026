const express = require("express");
const app = express();
app.use(express.json());

let missions = [];
let astronauts = [
  { name: "Ayesha Khan",  specialization: "Pilot",             skillLevel: "Advanced"     },
  { name: "Omar Malik",   specialization: "Robotics Engineer", skillLevel: "Intermediate" },
  { name: "Sara Qureshi", specialization: "Medical Officer",   skillLevel: "Advanced"     },
  { name: "Ali Hassan",   specialization: "Systems Engineer",  skillLevel: "Beginner"     },
];

// ── Task 4: Input Validation Middleware ──────────────────────
function validateMission(req, res, next) {
  const { missionName, crew } = req.body;
  if (!missionName || !crew) {
    return res.status(400).send("400 Invalid Request: Required fields missing");
  }
  next();
}

// POST /missions — validateMission runs before the route handler
app.post("/missions", validateMission, (req, res) => {
  const { missionName, crew: crewNames } = req.body;

  if (missions.find((m) => m.missionName === missionName)) {
    return res.status(400).send(`Mission "${missionName}" already exists`);
  }

  const crewMembers = [];
  for (const name of crewNames) {
    const astronaut = astronauts.find((a) => a.name === name);
    if (!astronaut) return res.status(404).send(`Astronaut "${name}" not found`);
    crewMembers.push(astronaut);
  }

  const newMission = { missionName, crew: crewMembers };
  missions.push(newMission);
  res.status(201).json(newMission);
});

// GET /missions — view all missions
app.get("/missions", (req, res) => {
  res.json(missions);
});

const PORT = 3004;
app.listen(PORT, () => console.log(`Task 4 running on http://localhost:${PORT}`));

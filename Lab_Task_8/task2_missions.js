const express = require("express");
const app = express();
app.use(express.json());

let astronauts = [
  { name: "Ayesha Khan",  specialization: "Pilot",             skillLevel: "Advanced"     },
  { name: "Omar Malik",   specialization: "Robotics Engineer", skillLevel: "Intermediate" },
  { name: "Sara Qureshi", specialization: "Medical Officer",   skillLevel: "Advanced"     },
  { name: "Ali Hassan",   specialization: "Systems Engineer",  skillLevel: "Beginner"     },
];

let missions = [];

const skillScore = { Advanced: 50, Intermediate: 30, Beginner: 10 };

function isAssigned(name) {
  return missions.some((m) => m.crew.some((a) => a.name === name));
}

// GET /astronauts — List all astronauts
app.get("/astronauts", (req, res) => {
  res.json(astronauts);
});

// POST /missions — Create a new mission
app.post("/missions", (req, res) => {
  const { missionName, crew: crewNames } = req.body;

  if (!missionName || !crewNames) {
    return res.status(400).send("Invalid Request: missionName and crew are required");
  }

  if (missions.find((m) => m.missionName === missionName)) {
    return res.status(400).send(`Mission "${missionName}" already exists`);
  }

  const crewMembers = [];
  for (const name of crewNames) {
    const astronaut = astronauts.find((a) => a.name === name);
    if (!astronaut) return res.status(404).send(`Astronaut "${name}" not found`);
    if (isAssigned(name)) {
      return res.status(400).send(`Astronaut "${name}" is already assigned to another mission`);
    }
    crewMembers.push(astronaut);
  }

  const newMission = { missionName, crew: crewMembers };
  missions.push(newMission);
  res.status(201).json(newMission);
});

// GET /missions/:missionName — Retrieve mission details
app.get("/missions/:missionName", (req, res) => {
  const mission = missions.find((m) => m.missionName === req.params.missionName);
  if (!mission) return res.status(404).send("Mission not found");

  const missionCapabilityScore = mission.crew.reduce(
    (total, a) => total + (skillScore[a.skillLevel] || 0),
    0
  );

  res.json({
    missionName: mission.missionName,
    crew: mission.crew.map((a) => a.name),
    missionCapabilityScore,
  });
});

// DELETE /missions/:missionName — Cancel a mission
app.delete("/missions/:missionName", (req, res) => {
  const index = missions.findIndex((m) => m.missionName === req.params.missionName);
  if (index === -1) return res.status(404).send("Mission not found");
  missions.splice(index, 1);
  res.send(`Mission "${req.params.missionName}" has been successfully cancelled`);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Task 2 running on http://localhost:${PORT}`));

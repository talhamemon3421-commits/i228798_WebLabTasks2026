const express = require("express");
const app = express();
app.use(express.json());

let courses = [
  { id: 1, name: "Data Structures", seats: 30 },
  { id: 2, name: "Operating Systems", seats: 25 },
];

// GET /courses — View all courses
app.get("/courses", (req, res) => {
  res.json(courses);
});

// GET /courses/:id — View a specific course
app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.json(course);
});

// POST /courses — Add a new course
app.post("/courses", (req, res) => {
  const { id, name, seats } = req.body;
  if (!id || !name || seats === undefined) {
    return res.status(400).send("Invalid Request: id, name, and seats are required");
  }
  const newCourse = { id, name, seats };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// PUT /courses/:id — Update seat capacity
app.put("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  const { seats } = req.body;
  if (seats === undefined) {
    return res.status(400).send("Invalid Request: seats field is required");
  }
  course.seats = seats;
  res.json(course);
});

// DELETE /courses/:id — Delete a course
app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Course not found");
  courses.splice(index, 1);
  res.send("Course deleted successfully");
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Task 1 running on http://localhost:${PORT}`));

const express = require("express");
const router = express.Router();

let missions = [
  {
    id: 0,
    title: "Mission #1",
    description: "Drink 2 liters of water",
  },
  {
    id: 1,
    title: "Mission #1",
    description: "Eat 5 servings of fruit.",
  },
  {
    id: 2,
    title: "Mission #2",
    description: "Eat 5 servings of fruits.",
  },
  {
    id: 3,
    title: "Mission #3",
    description: "Try a new vegetable.",
  },
];

// Get all missions
router.get("/", (req, res) => {
  res.json(missions);
});

// Get a specific mission by ID
router.get("/:id", (req, res) => {
  const mission = missions.find((m) => m.id === parseInt(req.params.id));
  if (!mission) return res.status(404).send("Mission not found.");
  res.json(mission);
});

// Create a new mission
router.post("/", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res.status(400).send("Title and description are required.");

  const newMission = {
    id: missions.length + 2,
    title,
    description,
  };
  missions.push(newMission);
  res.status(201).json(newMission);
});

// Update a mission by ID
router.put("/:id", (req, res) => {
  const { title, description } = req.body;
  const mission = missions.find((m) => m.id === parseInt(req.params.id));
  if (!mission) return res.status(404).send("Mission not found.");

  if (title) mission.title = title;
  if (description) mission.description = description;
  res.json(mission);
});

// Delete a mission by ID
router.delete("/:id", (req, res) => {
  const missionIndex = missions.findIndex(
    (m) => m.id === parseInt(req.params.id)
  );
  if (missionIndex === -1) return res.status(404).send("Mission not found.");

  const deletedMission = missions.splice(missionIndex, 1);
  res.json(deletedMission);
});

module.exports = router;

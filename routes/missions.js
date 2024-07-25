const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");

// GET a mission by date
router.get("/:email/:date", async (req, res) => {
  const { email, date } = req.params; // Extract both email and date from params

  try {
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    // Filter missions based on the date
    const mission = user.missions.filter(
      (mission) => mission.date.toISOString().split("T")[0] === date
    );

    if (mission.length === 0) return res.status(404).send("Mission not found.");
    res.json(mission); // Return the missions found
  } catch (err) {
    console.error("Error retrieving user information", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// POST a new mission
router.post("/add-mission", async (req, res) => {
  const { title, description, reward, status, number } = req.body;

  if (!title || !description) {
    return res.status(400).send("Title and description are required.");
  }

  const newMission = {
    title,
    description,
    reward,
    status: status !== undefined ? status : false,
    number,
  };

  try {
    await UserData.updateMany({}, { $push: { missions: newMission } });
    res.status(201).send("Mission added successfully to all users.");
  } catch (err) {
    console.error("Error adding mission", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// Update mission status by date if completed
router.put("/:email/:number", async (req, res) => {
  const { email, number } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    const mission = user.missions.find((m) => m.number === parseInt(number));
    if (!mission) return res.status(404).send("Mission not found.");
    if (mission.status) {
      return res.status(400).send("Mission already completed.");
    }

    mission.status = true;
    const reward = parseInt(mission.reward, 10);
    user.frogCoins = (user.frogCoins || 0) + reward;

    await user.save();
    res.status(200).send("Mission updated successfully.");
  } catch (err) {
    console.error("Error updating mission", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// DELETE a mission by date
router.delete("/:email/:date", async (req, res) => {
  const { email, date } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    const initialLength = user.missions.length;
    user.missions = user.missions.filter(
      (mission) => mission.date.toISOString().split("T")[0] !== date
    );

    if (user.missions.length === initialLength) {
      return res.status(404).send("Mission not found.");
    }

    await user.save();
    res.status(200).send("Mission deleted successfully.");
  } catch (err) {
    console.error("Error deleting mission", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

module.exports = router;

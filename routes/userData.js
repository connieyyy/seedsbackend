const express = require("express");
const UserData = require("../models/UserData");

const router = express.Router();

// Create new food log or mission entry
router.post("/log", async (req, res) => {
  const {
    email,
    date,
    foodDescription,
    foodName,
    water,
    waterLevels,
    title,
    description,
    status,
  } = req.body;

  try {
    const userData = await UserData.findOne({ email });
    if (!userData) {
      return res.status(404).send("User not found");
    }

    if (foodDescription || foodName || water || waterLevels) {
      userData.userFoodLogs.push({
        date,
        foodDescription,
        foodName,
        water,
        waterLevels,
      });
    }
    if (title || description || status !== undefined) {
      userData.missions.push({ date, title, description, status });
    }

    await userData.save();
    res.status(201).json(userData);
  } catch (error) {
    console.error("Error logging data", error);
    res.status(500).send("Internal server error");
  }
});

// Get all logs for a user
router.get("/:email/logs", async (req, res) => {
  const { email } = req.params;

  try {
    const userData = await UserData.findOne({ email });
    if (!userData) {
      return res.status(404).send("User not found");
    }

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

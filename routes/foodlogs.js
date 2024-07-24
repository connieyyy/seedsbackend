const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");

// POST: Create FoodLog Entry
router.post("/", async (req, res) => {
  const { email, foodName } = req.body;
  const date = req.body.date || new Date().toISOString().split("T")[0];

  // find user by email
  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    // create new food log entry
    const newFoodLog = { date, foodName };
    //add new food log to user's foodlogs
    user.FoodLogs.push(newFoodLog);
    // save updated user document
    await user.save();
    res.status(201).send("Food entry created successfully");
  } catch (err) {
    console.error("Error creating food entry", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// GET: Get foodlog entry route
router.get("/:email/:date", async (req, res) => {
  const { email, date } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    const foodLog = user.FoodLogs.filter(
      (log) => log.date.toISOString().split("T")[0] === date
    );

    if (!foodLog) return res.status(404).send("Food log entry not found.");
    res.json(foodLog);
  } catch (err) {
    console.error("Error retrieving food log entry", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

module.exports = router;

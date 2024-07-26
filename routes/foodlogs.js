const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");

// POST: Create FoodLog Entry
router.post("/", async (req, res) => {
  const { email, foodName, foodDescription, foodPhotoLink } = req.body;
  const date = req.body.date || new Date().toISOString().split("T")[0];

  // find user by email
  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    // create new food log entry
    const newFoodLog = {
      date,
      foodName,
      foodDescription,
      foodPhotoLink,
    };
    user.FoodLogs.push(newFoodLog);
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

router.delete("/:email/:foodId", async (req, res) => {
  const { email, foodId } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const foodLogIndex = user.FoodLogs.findIndex(
      (log) => log._id.toString() === foodId
    );
    if (foodLogIndex === -1) {
      return res.status(404).send("Food log entry not found.");
    }

    user.FoodLogs.splice(foodLogIndex, 1);
    await user.save();

    res.send("Food log entry deleted successfully.");
  } catch (err) {
    console.error("Error deleting food entry", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

module.exports = router;

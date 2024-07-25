const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");

// GET: get pet name from database
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    const pet = user.pet[0];
    if (!pet) return res.status(404).send("Pet not found.");
    res.json({
      petName: pet.petName,
      petHealthLevel: pet.petHealthLevel,
    });
  } catch (err) {
    console.error("Error retrieving pet information", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// PUT: update pet name
router.put("/:email/updatePetName", async (req, res) => {
  const { email } = req.params;
  const { newPetName } = req.body;
  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    if (user.pet.length > 0) {
      user.pet[0].petName = newPetName;
      await user.save();
      res.status(200).send("Pet name updated successfully");
    } else {
      res.status(404).send("Pet not found.");
    }
  } catch (err) {
    console.error("Error updating pet name", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// GET: get pet health from db
router.get("/:email/getHealth", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    const pet = user.pet[0];
    if (!pet) return res.status(404).send("Pet not found.");
    res.json({
      petHealthLevel: pet.petHealthLevel,
    });
  } catch (err) {
    console.error("Error retrieving pet information", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// PUT: update pet health from db
router.put("/:email/updateHealth", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pet[0].petHealthLevel = Math.min(user.pet[0].petHealthLevel - 1, 100);
    await user.save();

    res.status(200).json("Pet health updated successfully.");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");

// GET: get pet name from database
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserData.findOne({ email });
    console.log(user);
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

// PATCH: update pet name
router.put("/:email/updatePetName", async (req, res) => {
  const { email } = req.params;
  const { newPetName } = req.body;
  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    user.pet[0].petName = newPetName;
    await user.save();
    res.status(201).send("Pet name updated successfully");
  } catch (err) {
    console.error("Error updating pet name.", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// GET: get pet health from db
// PATCH: update pet health from db

module.exports = router;

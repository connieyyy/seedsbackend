const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");

// GET list of friends
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.friends.length === 0) {
      return res.status(200).send("No friends yet!");
    }

    res.status(200).json(user.friends);
  } catch (err) {
    console.error("Error fetching friends", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// POST add friend
router.post("/:email/:friendUsername", async (req, res) => {
  const { email, friendUsername } = req.params;

  try {
    const user = await UserData.findOne({ email });
    const friend = await UserData.findOne({ username: friendUsername });

    if (!user || !friend) {
      return res.status(404).send("User or friend not found");
    }

    if (user.friends.includes(friendUsername)) {
      return res.status(400).send("Friend already added");
    }

    user.friends.push(friendUsername);
    await user.save();

    res.status(200).send("Friend added successfully");
  } catch (err) {
    console.error("Error adding friend", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// DELETE remove friend
router.delete("/:email/:friendUsername", async (req, res) => {
  const { email, friendUsername } = req.params;

  try {
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.friends.includes(friendUsername)) {
      return res.status(400).send("Friend not found in the list");
    }

    user.friends = user.friends.filter((f) => f !== friendUsername);
    await user.save();

    res.status(200).send("Friend removed successfully");
  } catch (err) {
    console.error("Error removing friend", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const UserData = require("../models/userData");

// GET: get friends list -> get friends' username, image of their posts, food log [title, description]
router.get("/:email", async (req, res) => {
  try {
    const user = await UserData.findOne({ email: req.params.email }).exec();
    if (!user) return res.status(404).json({ message: "User not found." });

    const friends = await Promise.all(
      user.friends.map(async (friendUsername) => {
        const friend = await UserData.findOne({
          username: friendUsername,
        }).exec();
        if (!friend) return null;

        return {
          username: friend.username,
          posts: friend.FoodLogs.map((log) => log.foodPhotoLink),
          foodLogs: friend.FoodLogs.map((log) => ({
            title: log.foodName,
            description: log.foodDescription,
          })),
        };
      })
    );

    res.json(friends.filter((friend) => friend !== null));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

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

        const createUTCDateAtMidnight = (year, month, day) => {
          return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        };

        const today = new Date();
        const start = createUTCDateAtMidnight(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        );
        const end = createUTCDateAtMidnight(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() + 1
        );

        const foodLogsToday = friend.FoodLogs.filter((log) => {
          const logDate = new Date(log.date);
          return logDate >= start && logDate < end;
        });

        return {
          username: friend.username,
          posts: foodLogsToday.map((log) => log.foodPhotoLink),
          foodLogs: foodLogsToday.map((log) => ({
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

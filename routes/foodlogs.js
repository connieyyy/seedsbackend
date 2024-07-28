const express = require("express");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const path = require("path");
const UserData = require("../models/userData.js");

dotenv.config();

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(
        null,
        `uploads/${Date.now().toString()}${path.extname(file.originalname)}`
      );
    },
  }),
});

// POST: food log
router.post("/:email", upload.single("image"), async (req, res) => {
  try {
    const { email } = req.params;
    const { foodName, foodDescription } = req.body;
    const date = req.body.date || new Date().toISOString().split("T")[0];
    const foodPhotoLink = req.file ? req.file.location : null;

    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const newFoodLog = {
      date,
      foodName,
      foodDescription,
      foodPhotoLink,
    };

    user.FoodLogs.push(newFoodLog);
    user.frogCoins = user.frogCoins + 5;
    await user.save();

    res.status(201).send({ message: "Food log entry created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error creating food log entry" });
  }
});

// GET: Get food log entry route
router.get("/:email/:date", async (req, res) => {
  const { email, date } = req.params;

  try {
    const user = await UserData.findOne({ email });

    if (!user) return res.status(404).send("User not found.");
    const foodLog = user.FoodLogs.filter(
      (log) => log.date.toISOString().split("T")[0] === date
    );

    res.json(foodLog);
  } catch (err) {
    console.error("Error retrieving food log entry", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// DELETE: Remove food log entry
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
    user.pet[0].frogCoins = user.pet[0].frogCoins - 5;
    await user.save();

    res.send("Food log entry deleted successfully.");
  } catch (err) {
    console.error("Error deleting food entry", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

module.exports = router;

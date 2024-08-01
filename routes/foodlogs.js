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

// POST: Add food log
router.post("/:email", upload.single("image"), async (req, res) => {
  console.log("POST request received");
  try {
    const { email } = req.params; // Extract email from URL parameters
    const { foodName, foodDescription } = req.body;
    const date = req.body.date || new Date().toISOString().split("T")[0];
    const foodPhotoLink = req.file ? req.file.location : null;

    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newFoodLog = {
      date,
      foodName,
      foodDescription,
      foodPhotoLink,
    };

    user.FoodLogs.push(newFoodLog);
    user.frogCoins += 5;
    await user.save();
    //console.log("New food log added:", newFoodLog);

    res.status(201).json({ message: "Food log entry created successfully" });
  } catch (error) {
    console.error("Error creating food log entry:", error);
    res.status(500).json({ error: "Error creating food log entry" });
  }
});

// GET: Retrieve food log entries for a specific date
router.get("/:email/:date", async (req, res) => {
  const { email, date } = req.params;
  console.log(`Fetching food logs for email: ${email}, date: ${date}`);

  try {
    const user = await UserData.findOne({ email });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    // Convert the date parameter to 'YYYY-MM-DD' format
    const isoDate = new Date(date).toISOString().split("T")[0];
    console.log("ISO Date:", isoDate);

    // Ensure FoodLogs is an array and log its structure
    if (!Array.isArray(user.FoodLogs)) {
      console.error("FoodLogs is not an array:", user.FoodLogs);
      return res.status(500).json({ error: "FoodLogs data is not an array" });
    }

    // Filter food logs based on date
    const foodLog = user.FoodLogs.filter((log) => {
      let logDate;

      // Check if log.date is a Date object and convert it to string
      if (log.date instanceof Date) {
        logDate = log.date.toISOString().split("T")[0];
      } else {
        // Convert log.date to string if it's not a Date object
        logDate = String(log.date).split("T")[0];
      }

      console.log("Processed Log Date:", logDate); // Log the processed log date
      return logDate === isoDate;
    });

    console.log("Filtered food logs:", foodLog);
    res.json(foodLog);
  } catch (err) {
    console.error("Error retrieving food log entry:", err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// DELETE: Remove a food log entry
router.delete("/:email/:foodId", async (req, res) => {
  const { email, foodId } = req.params;

  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const foodLogIndex = user.FoodLogs.findIndex(
      (log) => log._id.toString() === foodId
    );

    if (foodLogIndex === -1) {
      return res.status(404).json({ error: "Food log entry not found" });
    }

    user.FoodLogs.splice(foodLogIndex, 1);
    user.frogCoins -= 5; // Fixed typo: 'pet' should be 'user'
    await user.save();

    res.json({ message: "Food log entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting food entry:", err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

module.exports = router;

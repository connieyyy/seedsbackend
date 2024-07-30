const express = require("express");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const path = require("path");
const StoreItem = require("../models/storeData.js");
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

// POST: post store item
router.post("/", upload.single("itemImage"), async (req, res) => {
  const { itemName, itemPrice, itemDescription, oneTime, itemType } = req.body;
  const itemImage = req.file?.location;

  if (!itemImage) {
    return res.status(400).json({ error: "Image upload failed" });
  }

  const newItem = new StoreItem({
    itemName,
    itemPrice,
    itemImage,
    itemDescription,
    oneTime,
    itemType,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error saving item:", err);
    res.status(500).json({ error: "Failed to create store item" });
  }
});

// GET: Get store items
router.get("/", async (req, res) => {
  try {
    const items = await StoreItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve store items" });
  }
});

// GET: Get frogcoins from user
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.json({
      frogCoins: user.frogCoins,
      purchasedItems: user.purchasedItems,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Update frogcoins for user
router.post("/:email/:itemId", async (req, res) => {
  try {
    const { email, itemId } = req.params;

    const user = await UserData.findOne({ email });
    if (!user) {
      console.error("User not found:", email);
      return res.status(404).send({ error: "User not found" });
    }
    const item = await StoreItem.findById(itemId);
    if (!item) {
      console.error("Item not found:", itemId);
      return res.status(404).send({ error: "Item not found" });
    }
    if (user.frogCoins < item.itemPrice) {
      console.error(
        "Insufficient coins. User coins:",
        user.frogCoins,
        "Item price:",
        item.itemPrice
      );
      return res.status(400).send({ error: "Insufficient coins" });
    }
    if (item.oneTime && user.purchasedItems.includes(itemId)) {
      console.error("Item already purchased:", itemId);
      return res.status(400).send({ error: "Item already purchased" });
    }

    user.frogCoins -= item.itemPrice;
    user.purchasedItems.push(itemId);
    await user.save();
    res.status(200).send({
      message: "Item purchased successfully",
      frogCoins: user.frogCoins,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

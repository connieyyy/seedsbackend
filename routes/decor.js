const express = require("express");
const router = express.Router();
const UserData = require("../models/userData");
const StoreData = require("../models/storeData");
const mongoose = require("mongoose");

// GET: Get user's purchased items
router.get("/:email", async (req, res) => {
  try {
    const user = await UserData.findOne({ email: req.params.email }).populate(
      "purchasedItems"
    );
    const purchasedItems = user.purchasedItems.map((item) => ({
      _id: item._id,
      itemName: item.itemName,
      itemImage: item.itemImage,
      itemType: item.itemType,
    }));
    res.json(purchasedItems);
  } catch (error) {
    res.status(500).send("Error fetching purchased items");
  }
});

// POST: Update frog health & inventory items
router.post("/:email", async (req, res) => {
  try {
    const { inventoryItem } = req.body;
    const healthChangeMap = {
      Bugsa: 1,
      Snail: 5,
      "Magic Berry": 10,
    };

    const storeItem = await StoreData.findOne({ itemName: inventoryItem });
    if (!storeItem) {
      return res.status(404).json({ error: "Store item not found" });
    }

    const inventoryItemObjectId = storeItem._id;
    const user = await UserData.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pet = user.pet[0];
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    pet.petHealthLevel += healthChangeMap[inventoryItem] || 0;
    if (pet.petHealthLevel > 100) {
      return res.status(404).json({ error: "Pet is full" });
    }

    const index = user.purchasedItems.findIndex((item) =>
      item.equals(inventoryItemObjectId)
    );
    if (index > -1) {
      user.purchasedItems.splice(index, 1);
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;

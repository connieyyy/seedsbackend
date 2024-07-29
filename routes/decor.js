const express = require("express");
const router = express.Router();
const UserData = require("../models/userData");

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

module.exports = router;

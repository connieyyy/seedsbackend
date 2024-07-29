const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  itemImage: { type: String, required: true },
  itemDescription: { type: String, required: true },
  oneTime: { type: Boolean, required: true },
  itemType: { type: String },
});

const StoreData = mongoose.model("storeData", storeSchema);

module.exports = StoreData;

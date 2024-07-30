const mongoose = require("mongoose");

const userFoodLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  foodName: { type: String, required: true },
  foodDescription: { type: String },
  foodPhotoLink: { type: String },
});

const userMissionsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: String,
  status: { type: Boolean, default: false },
  number: { type: Number, required: true },
});

const userPetSchema = new mongoose.Schema({
  petName: { type: String, required: true, default: "Froggy" },
  petHealthLevel: { type: Number, default: 70 },
});

const userDataSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  frogCoins: { type: Number, default: 0 },
  friends: [{ type: String }],
  pet: [userPetSchema],
  FoodLogs: [userFoodLogSchema],
  missions: [userMissionsSchema],
  purchasedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "storeData" }],
  accessory: { type: String, default: null },
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;

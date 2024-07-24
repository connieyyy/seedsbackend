const mongoose = require("mongoose");

const userFoodLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  foodName: { type: String, required: true },
});

const userMissionsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: String,
  status: { type: Boolean, default: false },
});

const userPetSchema = new mongoose.Schema({
  petName: { type: String, required: true, default: "Froggy" },
  petHealthLevel: { type: Number, default: 70 },
  petAge: { type: Number },
});

const userDataSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  frogCoins: { type: Number, default: 0 },
  pet: [userPetSchema],
  FoodLogs: [userFoodLogSchema],
  missions: [userMissionsSchema],
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;

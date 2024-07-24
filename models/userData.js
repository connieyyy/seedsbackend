const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  petName: String,
  petHealthLevel: Number,
  petMood: String,
  petAge: Number,
  userFoodLogs: [
    {
      date: { type: Date, default: Date.now },
      foodDescription: String,
      foodName: String,
      water: String,
      waterLevels: Number,
    },
  ],
  missions: [
    {
      date: { type: Date, default: Date.now },
      title: String,
      description: String,
      status: Boolean,
    },
  ],
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;

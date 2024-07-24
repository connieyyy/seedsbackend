const express = require("express");
const router = express.Router();
const UserData = require("../models/userData.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserData({
      email,
      name,
      password: hashedPassword,
      frogCoins: 0,
      pet: [],
      FoodLogs: [],
      missions: [],
    });

    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserData.findOne({ email });

  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid email or password");
  }

  try {
    const token = await admin.auth().createCustomToken(user._id.toString());
    res.json({ token });
  } catch (error) {
    console.error("Error creating custom token", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

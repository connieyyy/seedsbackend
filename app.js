const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
require("dotenv").config();

const missionsRouter = require("./routes/missions");
const app = express();

app.use(bodyParser.json());

// Login API
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("failed to connect to MongoDB", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// Firebase Admin SDK
const serviceAccount = require("./asset/firebasekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Signup route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).send("User created successfully");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Missions API

app.use(express.json());
app.use("/missions", missionsRouter);

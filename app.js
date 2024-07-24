const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
require("dotenv").config();

const userDataRouter = require("./routes/userData");
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Firebase Admin SDK
const serviceAccount = require("./asset/firebasekey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// User routes
app.use("/userdata", userDataRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

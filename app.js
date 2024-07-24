const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
require("dotenv").config();

const authRouter = require("./routes/auth");
const missionsRouter = require("./routes/missions");
const foodlogsRouter = require("./routes/foodlogs");
const petsRouter = require("./routes/pets");

const router = express();

router.use(bodyParser.json());

// Login API
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("failed to connect to MongoDB", err));

// Firebase Admin SDK
const serviceAccount = require("./asset/firebasekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.use("/auth", authRouter);
router.use("/missions", missionsRouter);
router.use("/foodlogs", foodlogsRouter);
router.use("/pets", petsRouter);

router.listen(3000, () => {
  console.log("Server is running on port 3000");
});

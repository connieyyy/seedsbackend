const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
require("dotenv").config();

const authRouter = require("./routes/auth");
const missionsRouter = require("./routes/missions");
const foodlogsRouter = require("./routes/foodlogs");
const petsRouter = require("./routes/pets");
const friendsRouter = require("./routes/friends");
const profileRouter = require("./routes/profile");
const apiRouter = require("./routes/chat");

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

app.use("/auth", authRouter);
app.use("/missions", missionsRouter);
app.use("/foodlogs", foodlogsRouter);
app.use("/pets", petsRouter);
app.use("/chat", apiRouter);
app.use("/profile", profileRouter);
app.use("/friends", friendsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

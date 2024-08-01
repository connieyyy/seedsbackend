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
const storeRouter = require("./routes/store");
const apiRouter = require("./routes/chat");
const feedRouter = require("./routes/feed");
const decorRouter = require("./routes/decor");

const app = express();

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Welcome to the base route!");
});

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
app.use("/friends", friendsRouter);
app.use("/feed", feedRouter);
app.use("/store", storeRouter);
app.use("/decor", decorRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

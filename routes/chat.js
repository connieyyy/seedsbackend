const axios = require("axios");
const express = require("express");
const router = express.Router();
const genAI = require("../geminiClient.js");
require("dotenv").config();

const FIND_RECIPE_API_URL =
  "https://api.spoonacular.com/recipes/complexSearch?sort=random&veryHealthy=true&number=1&apiKey=";
const GET_RECIPE_API_URL = "https://api.spoonacular.com/recipes/";

// POST: Ask Gemini
router.post("/askg", async (req, res) => {
  const { prompt } = req.body["prompt"];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent("short nutrition tip");
  const response = await result.response;
  const text = response.text();
  res.json({ reply: text });
});

// GET: Get spoonacular recipes
router.get("/", async (req, res) => {
  try {
    const foundRecipe = await axios.get(
      `${FIND_RECIPE_API_URL}${process.env.RECIPE_API_KEY}`
    );
    const id = foundRecipe.data["results"][0]["id"];

    const recipe = await axios.get(
      `${GET_RECIPE_API_URL}${id}/information?apiKey=${process.env.RECIPE_API_KEY}`
    );
    // Getting rid of HTML tags.
    const regex = /(<([^>]+)>)/gi;
    let instructions = recipe.data["instructions"];
    if (instructions !== null) {
      instructions = instructions.replace(regex, " ");
    }
    const title = recipe.data["title"];
    const readyInMinutes = recipe.data["readyInMinutes"];
    const image = recipe.data["image"];

    res.json({
      title,
      instructions,
      readyInMinutes,
      image,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Could not fetch recipe." });
  }
});

module.exports = router;

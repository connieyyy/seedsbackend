const express = require("express");
const router = express.Router();
const openai = require("../openaiClient.js");

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 5,
    });

    res.json({ reply: response.choices[0].text.trim() });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

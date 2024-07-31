const express = require("express");
const router = express.Router();
const openai = require("../openaiClient.js");
const genAI = require("../geminiClient.js");

router.post("/ask", async (req, res) => {
  const { prompt } = req.body["prompt"];

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

router.post("/askg", async (req, res) => {
  const { prompt } = req.body["prompt"];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent("short nutrition tip");
  const response = await result.response;
  const text = response.text();
  console.log(text);
  res.json({ reply: text });
});
module.exports = router;

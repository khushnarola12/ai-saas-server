const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET Test Route
router.route("/").get((req, res) => {
  res.send("Hello from DALLE");
  console.log(process.env.OPENAI_API_KEY);
});

// POST Image Generation Route
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, error: "Prompt is required." });
    }

    const aiResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
    });

    console.log("OpenAI Response:", aiResponse?.data?.[0]?.url);
    const image = aiResponse?.data?.[0]?.url;

    if (!image) {
      throw new Error("No image received from OpenAI");
    }

    res.status(200).json({ success: true, photo: image });
  } catch (error) {
    console.log(error);
    console.error(
      "DALLE API error:",
      error?.response?.data || error.message || error
    );

    res.status(500).json({
      success: false,
      error:
        error?.response?.data?.error?.message ||
        error.message ||
        "Internal Server Error",
    });
  }
});

module.exports = router;

// File: /api/flashcards.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required to generate flashcards" });
  }

  try {
    const prompt = `Generate flashcards (question-answer pairs) from the following study material:\n\n"${text}"\n\nReturn them as a JSON array like: [{"question": "...", "answer": "..."}]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that creates flashcards for studying." },
        { role: "user", content: prompt },
      ],
    });

    const flashcards = JSON.parse(response.choices[0].message.content);

    res.status(200).json({ flashcards });
  } catch (err) {
    console.error("Error generating flashcards:", err);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
}



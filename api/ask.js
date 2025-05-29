// File: /api/ask.js

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { question, context } = req.body;

  if (!question || !context) {
    return res.status(400).json({ error: "Both question and context are required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful tutor. Use the provided context to answer the question.",
        },
        {
          role: "user",
          content: `Context: ${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = response.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to answer the question" });
  }
}


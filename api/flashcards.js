import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an assistant that generates study flashcards.",
        },
        {
          role: "user",
          content: `Generate 5 flashcards from the following text. Each flashcard should be a question-answer pair:

${text}`,
        },
      ],
    });

    const answer = response.choices[0].message.content;
    res.status(200).json({ flashcards: answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
}


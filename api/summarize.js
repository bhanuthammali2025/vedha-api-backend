import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Missing 'text' in request body" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes documents concisely."
        },
        { role: "user", content: `Summarize this document:\n\n${text}` }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    res.status(200).json({ summary: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate summary." });
  }
}

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { question, context } = req.body;
  if (!question || !context) {
    return res.status(400).json({ message: "Missing 'question' or 'context' in request body" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You answer questions based on the provided context."
        },
        { role: "user", content: `Context:\n${context}\n\nQuestion:\n${question}` }
      ],
      max_tokens: 700,
      temperature: 0.3,
    });

    res.status(200).json({ answer: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to answer question." });
  }
}

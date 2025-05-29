import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Missing 'content' in request body" });
    }

    console.log("Received content to summarize:", content);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // or another model like "gpt-4" or "gpt-3.5-turbo"
      messages: [
        {
          role: "user",
          content: `Summarize the following text:\n\n${content}`,
        },
      ],
      max_tokens: 500,
    });

    const summary = response.choices[0].message.content;
    console.log("Summary generated:", summary);

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Failed to summarize" });
  }
}




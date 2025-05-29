import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { content, question } = req.body;

    if (!content || !question) {
      return res.status(400).json({ error: 'Missing content or question' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Answer questions based on the given document content.' },
        { role: 'user', content: `Based on this content:\n${content}\n\nAnswer this question: ${question}` },
      ],
    });

    res.status(200).json({ answer: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
}

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Missing content' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Generate flashcards (question and answer pairs) for studying.' },
        { role: 'user', content: `Create 5 flashcards from this content:\n\n${content}` },
      ],
    });

    res.status(200).json({ flashcards: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
}

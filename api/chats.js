export default async function handler(req, res) {
  // Set CORS headers so your Surge.sh frontend can call this backend securely
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model = 'llama-3.3-70b-versatile', temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY environment variable is not set on server.' });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        temperature: temperature,
        messages: [
          {
            role: 'system',
            content: 'You are Aura AI, a high-speed, helpful, and concise AI assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({ error: data.error || 'Groq API request failed' });
    }

    const reply = data.choices[0]?.message?.content || 'No response generated.';

    return res.status(200).json({
      status: 'success',
      model: model,
      reply: reply,
      usage: data.usage || {}
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Internal server error processing query' });
  }
}

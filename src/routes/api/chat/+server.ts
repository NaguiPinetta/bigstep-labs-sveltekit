// src/routes/api/chat/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const POST: RequestHandler = async ({ request }) => {
	const { prompt, history } = await request.json();

	const messages = [
		{
			role: 'system',
			content:
				'Você é um assistente de idiomas motivador que ajuda alunos a praticar inglês com base em frases e correções guiadas.'
		},
		...(history || []),
		{ role: 'user', content: prompt }
	];

	const res = await fetch(OPENAI_API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${OPENAI_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'gpt-4',
			messages,
			temperature: 0.6
		})
	});

	if (!res.ok) {
		console.error('OpenAI API Error:', await res.text());
		return json(
			{ reply: 'Desculpe, algo deu errado ao tentar gerar uma resposta.' },
			{ status: 500 }
		);
	}

	const data = await res.json();
	const reply = data.choices[0]?.message?.content ?? '...';

	return json({ reply });
};

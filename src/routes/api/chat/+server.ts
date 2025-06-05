// src/routes/api/chat/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';
import { getModel, getPromptForModel } from '$lib/server/llm';

export const POST: RequestHandler = async ({ request }) => {
	const { prompt, history, modelId, customPrompt } = await request.json();
	console.log('Received chat request:', { prompt, history, modelId, customPrompt });

	const selectedModelId = modelId || 'gpt-3.5-turbo';
	const model = getModel(selectedModelId);
	const systemPrompt = customPrompt || getPromptForModel(selectedModelId);

	const messages = [
		{ role: 'system', content: systemPrompt },
		...history.map((m: any) => ({
			role: m.role,
			content: m.content
		})),
		{ role: 'user', content: prompt }
	];

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: model?.model || 'gpt-3.5-turbo',
			messages
		})
	});

	const raw = await response.text();
	console.log('OpenAI response:', raw);

	if (!response.ok) {
		return json({ reply: 'Erro ao conectar ao modelo GPT.' }, { status: 500 });
	}

	const data = JSON.parse(raw);
	const reply = data.choices?.[0]?.message?.content ?? 'Sem resposta do modelo.';

	return json({ reply });
};

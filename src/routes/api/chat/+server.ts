// src/routes/api/chat/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';
import { getModel } from '$lib/server/llm';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
	process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const POST: RequestHandler = async ({ request, locals }) => {
	const { prompt, history, modelId, customPrompt } = await request.json();
	const user = locals.user;
	console.log(
		'API/chat received modelId:',
		modelId,
		'user.id:',
		user?.id,
		'customPrompt:',
		customPrompt
	);
	if (!user || !user.id) {
		return json({ reply: 'Usuário não autenticado.' }, { status: 401 });
	}

	const trimmedModelId = (modelId || '').trim();
	const trimmedUserId = (user.id || '').trim();
	console.log(
		'API/chat querying with modelId:',
		trimmedModelId,
		typeof trimmedModelId,
		'userId:',
		trimmedUserId,
		typeof trimmedUserId
	);

	const selectedModelId = trimmedModelId || 'gpt-3.5-turbo';

	// Try to fetch the model profile from Supabase
	let systemPrompt = 'You are a helpful assistant.';
	let model = getModel(selectedModelId) || { model: 'gpt-3.5-turbo' };

	const { data: modelProfile, error } = await supabase
		.from('models')
		.select('*')
		.eq('id', trimmedModelId)
		.eq('user_id', trimmedUserId)
		.maybeSingle();

	console.log('Fetched modelProfile:', modelProfile);

	if (error) {
		console.error('Error fetching model profile from Supabase:', error);
	}
	if (modelProfile) {
		systemPrompt = modelProfile.system_prompt || systemPrompt;
		model = { ...model, ...modelProfile };
	}
	if (customPrompt) {
		console.log('Overriding systemPrompt with customPrompt from UI:', customPrompt);
		systemPrompt = customPrompt;
	}
	console.log('Using system prompt:', systemPrompt);

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

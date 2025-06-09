// src/routes/api/chat/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY, GEMINI_API_KEY } from '$env/static/private';
import { getModel } from '$lib/server/llm';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
	process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('--- ENV DEBUG ---');
console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? OPENAI_API_KEY.slice(0, 8) + '...' : 'undefined');
console.log('GEMINI_API_KEY:', GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 8) + '...' : 'undefined');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey?.slice(0, 8) + '...');
console.log('All env keys loaded:', Object.keys(process.env));

export const POST: RequestHandler = async ({ request, locals }) => {
	const { prompt, history, modelId, customPrompt } = await request.json();
	const user = locals.user;

	console.log('\n--- CHAT API REQUEST ---');
	console.log('Prompt:', prompt);
	console.log('History:', history);
	console.log('modelId:', modelId);
	console.log('customPrompt:', customPrompt);
	console.log('User:', user);

	if (!user || !user.id) {
		console.warn('User not authenticated');
		return json({ reply: 'Usuário não autenticado.' }, { status: 401 });
	}

	const trimmedModelId = (modelId || '').trim();
	const trimmedUserId = (user.id || '').trim();

	const fallbackModel = 'gpt-3.5-turbo';
	let systemPrompt = 'You are a helpful assistant.';
	let model = getModel(trimmedModelId) || { model: fallbackModel };

	const { data: modelProfile, error } = await supabase
		.from('models')
		.select('*')
		.eq('id', trimmedModelId)
		.eq('user_id', trimmedUserId)
		.maybeSingle();

	if (error) {
		console.error('❌ Error fetching model profile:', error);
	}
	if (!modelProfile) {
		console.error('❌ No model profile found for modelId:', trimmedModelId);
		return json({ reply: 'Model profile not found.' }, { status: 404 });
	}

	console.log('✅ Fetched model profile:', modelProfile);

	if (modelProfile.system_prompt) systemPrompt = modelProfile.system_prompt;
	if (customPrompt) {
		systemPrompt = customPrompt;
		console.log('📝 Overriding system prompt with custom prompt.');
	}
	model = { ...model, ...modelProfile };

	if (!model.model) {
		console.error('❌ Model name missing in profile:', modelProfile);
		return json({ reply: 'Model name is not set for this profile.' }, { status: 400 });
	}

	console.log('Using model:', model.model);
	console.log('Provider:', model.provider);
	console.log('System Prompt:', systemPrompt);

	// === OpenAI ===
	if (model.provider === 'openai') {
		const messages = [
			{ role: 'system', content: systemPrompt },
			...history.map((m: any) => ({ role: m.role, content: m.content })),
			{ role: 'user', content: prompt }
		];

		const payload = {
			model: model.model,
			messages
		};

		console.log('\n--- OpenAI REQUEST ---');
		console.log('URL:', 'https://api.openai.com/v1/chat/completions');
		console.log('Authorization:', `Bearer ${OPENAI_API_KEY?.slice(0, 8)}...`);
		console.log('Payload:', JSON.stringify(payload, null, 2));

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify(payload)
		});

		const raw = await response.text();
		console.log('\n--- OpenAI RESPONSE ---');
		console.log('Status:', response.status);
		console.log('Body:', raw);

		if (!response.ok) {
			console.error('❌ Error response from OpenAI');
			return json({ reply: 'Erro ao conectar ao modelo GPT.' }, { status: 500 });
		}

		const data = JSON.parse(raw);
		const reply = data.choices?.[0]?.message?.content ?? 'Sem resposta do modelo.';
		return json({ reply });
	}

	// === Gemini ===
	if (model.provider === 'gemini') {
		console.log('🧪 Gemini logic not yet implemented.');
		console.log('GEMINI_API_KEY:', GEMINI_API_KEY?.slice(0, 8) + '...');
		return json({ reply: 'Gemini provider is not yet implemented.' }, { status: 501 });
	}

	console.warn('❓ Unknown provider:', model.provider);
	return json({ reply: `Provider ${model.provider} is not supported.` }, { status: 400 });
};

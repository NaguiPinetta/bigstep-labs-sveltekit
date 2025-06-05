import { listModels } from '$lib/server/llm';

export function load() {
	const models = listModels();
	console.log('Loaded models:', models);
	return {
		models
	};
}

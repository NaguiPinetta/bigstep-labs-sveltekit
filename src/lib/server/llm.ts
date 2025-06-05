console.log('llm.ts loaded on', typeof window === 'undefined' ? 'server' : 'client');

export type LLMModel = {
	id: string;
	name: string;
	provider: 'openai' | 'other';
	model: string;
	defaultPrompt: string;
	description?: string;
};

const models: LLMModel[] = [
	{
		id: 'gpt-3.5-turbo',
		name: 'GPT-3.5 Turbo',
		provider: 'openai',
		model: 'gpt-3.5-turbo',
		defaultPrompt: 'You are a helpful assistant.',
		description: 'Fast and cost-effective for most tasks.'
	},
	{
		id: 'gpt-4',
		name: 'GPT-4',
		provider: 'openai',
		model: 'gpt-4',
		defaultPrompt: 'You are a highly intelligent assistant.',
		description: 'More capable, but slower and more expensive.'
	}
	// Add more models as needed
];

// In-memory custom prompts (replace with DB if needed)
const customPrompts: Record<string, string> = {};

export function listModels() {
	return models;
}

export function getModel(id: string): LLMModel | undefined {
	return models.find((m) => m.id === id);
}

export function getPromptForModel(id: string): string {
	return customPrompts[id] || getModel(id)?.defaultPrompt || '';
}

export function setPromptForModel(id: string, prompt: string) {
	customPrompts[id] = prompt;
}

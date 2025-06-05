import { writable } from 'svelte/store';

export type ModelProfile = {
	id: string;
	name: string;
	description: string;
	apiKeyId: string;
	provider: string;
	systemPrompt: string;
};

function loadModels(): ModelProfile[] {
	if (typeof window !== 'undefined') {
		try {
			return JSON.parse(localStorage.getItem('model_profiles') || '[]');
		} catch {
			return [];
		}
	}
	return [];
}

function saveModels(models: ModelProfile[]) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('model_profiles', JSON.stringify(models));
	}
}

function createModelsStore() {
	const { subscribe, set, update } = writable<ModelProfile[]>(loadModels());

	function refresh() {
		set(loadModels());
	}

	return {
		subscribe,
		addModel: (model: ModelProfile) => {
			update((models) => {
				const newModels = [...models, model];
				saveModels(newModels);
				return newModels;
			});
		},
		updateModel: (id: string, updated: Partial<ModelProfile>) => {
			update((models) => {
				const newModels = models.map((m) => (m.id === id ? { ...m, ...updated } : m));
				saveModels(newModels);
				return newModels;
			});
		},
		deleteModel: (id: string) => {
			update((models) => {
				const newModels = models.filter((m) => m.id !== id);
				saveModels(newModels);
				return newModels;
			});
		},
		refresh
	};
}

export const models = createModelsStore();

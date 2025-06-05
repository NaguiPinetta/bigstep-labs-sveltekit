import { writable } from 'svelte/store';
import { user } from './user';

export type ModelProfile = {
	id: string;
	name: string;
	description: string;
	apiKeyId: string;
	provider: string;
	systemPrompt: string;
	user_id: string;
};

let currentUserId = '';
user.subscribe((u) => {
	currentUserId = u?.id || '';
});

function storageKey() {
	return currentUserId ? `bigstep-models-${currentUserId}` : 'bigstep-models-guest';
}

function loadModels(): ModelProfile[] {
	if (typeof window !== 'undefined') {
		try {
			return JSON.parse(localStorage.getItem(storageKey()) || '[]');
		} catch {
			return [];
		}
	}
	return [];
}

function saveModels(models: ModelProfile[]) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(storageKey(), JSON.stringify(models));
	}
}

function createModelsStore() {
	const { subscribe, set, update } = writable<ModelProfile[]>(loadModels());

	function refresh() {
		set(loadModels());
	}

	function setUserId(newId: string) {
		currentUserId = newId;
		refresh();
	}

	return {
		subscribe,
		setUserId,
		addModel: (model: ModelProfile) => {
			update((models) => {
				const newModels = [model, ...models];
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

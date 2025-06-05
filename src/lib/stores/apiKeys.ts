import { writable } from 'svelte/store';
import { user } from './user';

export type ApiKey = {
	id: string;
	provider: string;
	key: string;
	user_id: string;
};

let currentUserId = '';
user.subscribe((u) => {
	currentUserId = u?.id || '';
});

function storageKey() {
	return currentUserId ? `bigstep-api-keys-${currentUserId}` : 'bigstep-api-keys-guest';
}

function loadKeys(): ApiKey[] {
	if (typeof window !== 'undefined') {
		try {
			return JSON.parse(localStorage.getItem(storageKey()) || '[]');
		} catch {
			return [];
		}
	}
	return [];
}

function saveKeys(keys: ApiKey[]) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(storageKey(), JSON.stringify(keys));
	}
}

function createApiKeysStore() {
	const { subscribe, set, update } = writable<ApiKey[]>(loadKeys());

	function refresh() {
		set(loadKeys());
	}

	function setUserId(newId: string) {
		currentUserId = newId;
		refresh();
	}

	return {
		subscribe,
		setUserId,
		addKey: (key: ApiKey) => {
			update((keys) => {
				const newKeys = [key, ...keys];
				saveKeys(newKeys);
				return newKeys;
			});
		},
		updateKey: (id: string, updated: Partial<ApiKey>) => {
			update((keys) => {
				const newKeys = keys.map((k) => (k.id === id ? { ...k, ...updated } : k));
				saveKeys(newKeys);
				return newKeys;
			});
		},
		deleteKey: (id: string) => {
			update((keys) => {
				const newKeys = keys.filter((k) => k.id !== id);
				saveKeys(newKeys);
				return newKeys;
			});
		},
		refresh
	};
}

export const apiKeys = createApiKeysStore();

import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from './user';

export type ApiKey = {
	id: string;
	provider: string;
	key: string;
	user_id: string;
};

function createApiKeysStore() {
	const { subscribe, set, update } = writable<ApiKey[]>([]);

	async function fetchApiKeys() {
		const currentUserId = get(user)?.id || '';
		console.log('[apiKeys] fetchApiKeys for user_id:', currentUserId);
		const { data, error } = await supabase
			.from('api_keys')
			.select('*')
			.eq('user_id', currentUserId);
		if (error) {
			console.error('[apiKeys] Error fetching API keys:', error);
			set([]);
			return;
		}
		console.log('[apiKeys] API keys fetched:', data);
		set(data || []);
	}

	async function addKey(key: Omit<ApiKey, 'id'>) {
		console.log('[apiKeys] addKey called with:', key);
		const { data, error } = await supabase.from('api_keys').insert([key]).select();
		if (error) {
			console.error('[apiKeys] Error adding API key:', error);
			return;
		}
		console.log('[apiKeys] API key added:', data);
		await fetchApiKeys();
	}

	async function updateKey(id: string, updated: Partial<ApiKey>) {
		const { error } = await supabase.from('api_keys').update(updated).eq('id', id);
		if (error) {
			console.error('[apiKeys] Error updating API key:', error);
			return;
		}
		await fetchApiKeys();
	}

	async function deleteKey(id: string) {
		const { error } = await supabase.from('api_keys').delete().eq('id', id);
		if (error) {
			console.error('[apiKeys] Error deleting API key:', error);
			return;
		}
		await fetchApiKeys();
	}

	return {
		subscribe,
		fetchApiKeys,
		addKey,
		updateKey,
		deleteKey
	};
}

export const apiKeys = createApiKeysStore();

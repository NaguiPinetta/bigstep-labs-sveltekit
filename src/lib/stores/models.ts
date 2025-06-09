import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from './user';

export type ModelProfile = {
	id: string;
	name: string;
	description: string;
	api_key_id: string;
	provider: string;
	system_prompt: string;
	user_id: string;
};

function createModelsStore() {
	const { subscribe, set, update } = writable<ModelProfile[]>([]);

	async function fetchModels() {
		const currentUserId = get(user)?.id || '';
		console.log('[models] fetchModels for user_id:', currentUserId);
		const { data, error } = await supabase.from('models').select('*').eq('user_id', currentUserId);
		if (error) {
			console.error('[models] Error fetching models:', error);
			set([]);
			return;
		}
		console.log('[models] Models fetched:', data);
		set(data || []);
	}

	async function addModel(model: Omit<ModelProfile, 'id'>) {
		console.log('[models] addModel called with:', model);
		const { data, error } = await supabase.from('models').insert([model]).select();
		if (error) {
			console.error('[models] Error adding model:', error);
			return error;
		}
		console.log('[models] Model added:', data);
		await fetchModels();
		return null;
	}

	async function updateModel(id: string, updated: Partial<ModelProfile>) {
		const { error } = await supabase.from('models').update(updated).eq('id', id);
		if (error) {
			console.error('Error updating model:', error);
			return;
		}
		await fetchModels();
	}

	async function deleteModel(id: string) {
		const { error } = await supabase.from('models').delete().eq('id', id);
		if (error) {
			console.error('Error deleting model:', error);
			return;
		}
		await fetchModels();
	}

	return {
		subscribe,
		fetchModels,
		addModel,
		updateModel,
		deleteModel
	};
}

export const models = createModelsStore();

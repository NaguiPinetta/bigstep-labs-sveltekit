import { writable } from 'svelte/store';

function getLocal(key: string, fallback: string) {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(key) || fallback;
	}
	return fallback;
}

export const selectedModelId = writable(getLocal('selectedModelId', 'gpt-3.5-turbo'));
export const customPrompt = writable(getLocal('customPrompt', 'You are a helpful assistant.'));

import { writable } from 'svelte/store';

export const user = writable<{
	id: string;
	name: string;
	email: string;
	avatar_url: string;
} | null>(null);

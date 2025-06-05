import { writable } from 'svelte/store';
export const toast = writable<{ message: string; type?: string } | null>(null);

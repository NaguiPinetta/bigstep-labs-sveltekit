import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'dark' | 'light' | 'system';

// Get initial theme from localStorage or default to 'system'
const storedTheme = browser ? (localStorage.getItem('theme') as Theme) : 'system';
const initialTheme = storedTheme || 'system';

// Create the store
export const theme = writable<Theme>(initialTheme);

// Subscribe to changes and update localStorage
if (browser) {
	theme.subscribe((value) => {
		localStorage.setItem('theme', value);

		// Update document class for dark mode
		if (
			value === 'dark' ||
			(value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
}

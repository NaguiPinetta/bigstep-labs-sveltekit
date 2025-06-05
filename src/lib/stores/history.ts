import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { user } from './user';

export type ChatMessage = {
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
};

export type ChatSession = {
	id: string;
	started: string; // ISO date string
	modelId: string;
	modelName: string;
	messages: ChatMessage[];
	user_id: string;
};

let currentUserId = '';
user.subscribe((u) => {
	currentUserId = u?.id || '';
});

function storageKey() {
	return currentUserId ? `bigstep-chat-sessions-${currentUserId}` : 'bigstep-chat-sessions-guest';
}

function loadSessions(): ChatSession[] {
	if (typeof localStorage !== 'undefined') {
		try {
			return JSON.parse(localStorage.getItem(storageKey()) || '[]');
		} catch {
			return [];
		}
	}
	return [];
}

function saveSessions(sessions: ChatSession[]) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(storageKey(), JSON.stringify(sessions));
	}
}

function createHistoryStore() {
	const { subscribe, set, update } = writable<ChatSession[]>(loadSessions());

	function refresh() {
		set(loadSessions());
	}

	function setUserId(newId: string) {
		currentUserId = newId;
		refresh();
	}

	return {
		subscribe,
		refresh,
		setUserId,
		addSession: (session: ChatSession) => {
			update((sessions) => {
				const newSessions = [session, ...sessions];
				saveSessions(newSessions);
				return newSessions;
			});
		},
		updateSession: (id: string, updated: Partial<ChatSession>) => {
			update((sessions) => {
				const newSessions = sessions.map((s) => (s.id === id ? { ...s, ...updated } : s));
				saveSessions(newSessions);
				return newSessions;
			});
		},
		deleteSession: (id: string) => {
			update((sessions) => {
				const newSessions = sessions.filter((s) => s.id !== id);
				saveSessions(newSessions);
				return newSessions;
			});
		},
		getSession: (id: string) => {
			const sessions = loadSessions();
			return sessions.find((s) => s.id === id);
		},
		clear: () => {
			saveSessions([]);
			set([]);
		}
	};
}

export const history = createHistoryStore();

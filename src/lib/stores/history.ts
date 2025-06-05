import { writable } from 'svelte/store';

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
};

const STORAGE_KEY = 'bigstep-chat-sessions';

function loadSessions(): ChatSession[] {
	if (typeof localStorage !== 'undefined') {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		} catch {
			return [];
		}
	}
	return [];
}

function saveSessions(sessions: ChatSession[]) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
	}
}

function createHistoryStore() {
	const { subscribe, set, update } = writable<ChatSession[]>(loadSessions());

	function refresh() {
		set(loadSessions());
	}

	return {
		subscribe,
		refresh,
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

import { supabase } from '$lib/supabaseClient';
import { user } from '$lib/stores/user';
import { history } from '$lib/stores/history';
import { models } from '$lib/stores/models';
import { apiKeys } from '$lib/stores/apiKeys';

// On app load, check for existing session
function syncSupabaseSessionToCookies(session) {
	if (session?.access_token && session?.refresh_token) {
		document.cookie = `sb-access-token=${session.access_token}; path=/`;
		document.cookie = `sb-refresh-token=${session.refresh_token}; path=/`;
	} else {
		// Clear cookies on logout
		document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}

supabase.auth.getUser().then(({ data, error }) => {
	console.log('[hooks.client] supabase.auth.getUser:', { data, error });
	if (data?.user) {
		const { id, email, user_metadata } = data.user;
		user.set({
			id: id || '',
			email: email || '',
			name: user_metadata?.full_name || user_metadata?.name || email || '',
			avatar_url: (user_metadata?.avatar_url || '') as string
		});
		console.log('[hooks.client] user.set (from getUser)', {
			id: id || '',
			email: email || '',
			name: user_metadata?.full_name || user_metadata?.name || email || '',
			avatar_url: (user_metadata?.avatar_url || '') as string
		});
		supabase.auth.getSession().then(({ data: sessionData }) => {
			syncSupabaseSessionToCookies(sessionData?.session);
		});
	} else {
		user.set(null);
		console.log('[hooks.client] user.set(null) (from getUser)');
		syncSupabaseSessionToCookies(null);
	}
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
	console.log('[hooks.client] supabase.auth.onAuthStateChange:', { _event, session });
	if (session?.user) {
		const { id, email, user_metadata } = session.user;
		user.set({
			id: id || '',
			email: email || '',
			name: user_metadata?.full_name || user_metadata?.name || email || '',
			avatar_url: (user_metadata?.avatar_url || '') as string
		});
		console.log('[hooks.client] user.set (from onAuthStateChange)', {
			id: id || '',
			email: email || '',
			name: user_metadata?.full_name || user_metadata?.name || email || '',
			avatar_url: (user_metadata?.avatar_url || '') as string
		});
		syncSupabaseSessionToCookies(session);
	} else {
		user.set(null);
		console.log('[hooks.client] user.set(null) (from onAuthStateChange)');
		syncSupabaseSessionToCookies(null);
	}
});

// Keep all stores in sync with the current user
user.subscribe((u) => {
	history.setUserId(u?.id || '');
	// models.setUserId(u?.id || ''); // Removed, not needed for Supabase-backed store
	// apiKeys.setUserId(u?.id || ''); // Removed, not needed for Supabase-backed store
});

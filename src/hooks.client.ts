import { supabase } from '$lib/supabaseClient';
import { user } from '$lib/stores/user';
import { history } from '$lib/stores/history';
import { models } from '$lib/stores/models';
import { apiKeys } from '$lib/stores/apiKeys';

// On app load, check for existing session
supabase.auth.getUser().then(({ data, error }) => {
	if (data?.user) {
		const { id, email, user_metadata } = data.user;
		user.set({
			id: id || '',
			email: email || '',
			name: user_metadata?.full_name || user_metadata?.name || email || '',
			avatar_url: (user_metadata?.avatar_url || '') as string
		});
	} else {
		user.set(null);
	}
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
	if (session?.user) {
		const { id, email, user_metadata } = session.user;
		user.set({
			id: id || '',
			email: email || '',
			name: user_metadata?.full_name || user_metadata?.name || email || '',
			avatar_url: (user_metadata?.avatar_url || '') as string
		});
	} else {
		user.set(null);
	}
});

// Keep all stores in sync with the current user
user.subscribe((u) => {
	history.setUserId(u?.id || '');
	models.setUserId(u?.id || '');
	apiKeys.setUserId(u?.id || '');
});

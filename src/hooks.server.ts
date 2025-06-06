import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import { supabase } from '$lib/supabaseClient';
import type { Handle } from '@sveltejs/kit';

// Extend event.locals type for user

declare module '@sveltejs/kit' {
	interface Locals {
		user: {
			id: string;
			email: string;
			name: string;
			avatar_url: string;
		} | null;
	}
}

const handleAuth: Handle = async ({ event, resolve }) => {
	const supabaseToken = event.cookies.get('sb-access-token');
	if (!supabaseToken) {
		event.locals.user = null;
		return resolve(event);
	}

	const { data, error } = await supabase.auth.getUser(supabaseToken);
	if (error || !data?.user) {
		event.locals.user = null;
		return resolve(event);
	}

	const { id, email, user_metadata } = data.user;
	event.locals.user = {
		id: id || '',
		email: email || '',
		name: user_metadata?.full_name || user_metadata?.name || email || '',
		avatar_url: (user_metadata?.avatar_url || '') as string
	} as unknown as typeof event.locals.user;

	return resolve(event);
};

export const handle = sequence(handleAuth, i18n.handle());

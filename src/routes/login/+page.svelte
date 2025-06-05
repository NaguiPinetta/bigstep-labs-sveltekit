<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';

	let email = '';
	let error = '';
	let loading = false;

	async function signInWithGoogle() {
		loading = true;
		error = '';
		const { error: err } = await supabase.auth.signInWithOAuth({ provider: 'google' });
		if (err) error = err.message;
		loading = false;
	}

	async function signInWithMagicLink() {
		error = '';
		if (email !== 'jdpinetta@gmail.com') {
			error = 'Only jdpinetta@gmail.com is allowed for magic link login.';
			return;
		}
		loading = true;
		const { error: err } = await supabase.auth.signInWithOtp({ email });
		if (err) error = err.message;
		else error = 'Check your email for the login link!';
		loading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<div class="w-full max-w-md rounded-lg bg-card p-8 shadow">
		<h1 class="mb-6 text-2xl font-bold">Sign in to BigStep</h1>
		<button
			class="mb-4 w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
			on:click={signInWithGoogle}
			disabled={loading}
		>
			{loading ? 'Loading...' : 'Sign in with Google'}
		</button>
		<div class="my-4 text-center text-muted-foreground">or</div>
		<form on:submit|preventDefault={signInWithMagicLink} class="flex flex-col gap-2">
			<input
				type="email"
				placeholder="Magic link email"
				bind:value={email}
				class="rounded border border-input bg-background p-2 text-sm"
				required
			/>
			<button class="rounded bg-muted px-4 py-2 text-sm" type="submit" disabled={loading}
				>Send Magic Link</button
			>
		</form>
		{#if error}
			<div class="mt-4 text-sm text-red-600">{error}</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let error = '';
	let email = '';

	async function signInWithMagicLink() {
		loading = true;
		error = '';
		const { error: err } = await supabase.auth.signInWithOtp({ email });
		if (err) error = err.message;
		else error = 'Check your email for the login link!';
		loading = false;
	}
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login with your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<form on:submit|preventDefault={signInWithMagicLink} class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" placeholder="you@email.com" bind:value={email} required />
				<Button type="submit" class="w-full" disabled={loading || !email}>
					{loading ? 'Sending...' : 'Send Magic Link'}
				</Button>
			</form>
			{#if error}
				<div class="mt-2 text-sm text-red-600">{error}</div>
			{/if}
		</div>
		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="https://www.bigstepidiomas.com" target="_blank" class="underline"> Sign up </a>
		</div>
	</Card.Content>
</Card.Root>

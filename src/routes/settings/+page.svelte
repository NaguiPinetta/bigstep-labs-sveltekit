<script lang="ts">
	import { onMount } from 'svelte';
	import { Card } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { apiKeys, type ApiKey } from '$lib/stores/apiKeys';
	import { get } from 'svelte/store';
	import { user } from '$lib/stores/user';

	const PROVIDERS = [
		{ label: 'OpenAI (GPT)', value: 'openai' },
		{ label: 'Gemini', value: 'gemini' },
		{ label: 'DeepSeek', value: 'deepseek' }
	];

	let provider = PROVIDERS[0].value;
	let apiKey = '';
	let editingIndex: number | null = null;
	let editingKey = '';
	let showKey: Record<number, boolean> = {};
	let toast = '';
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;
	let error = '';

	let keys: ApiKey[] = [];
	const unsubscribe = apiKeys.subscribe((val) => (keys = val));

	function showToast(message: string) {
		toast = message;
		console.log('[toast] showToast called with:', message);
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => (toast = ''), 2000);
	}

	onMount(() => {
		apiKeys.fetchApiKeys();
	});

	async function addKey() {
		if (!apiKey.trim()) return;
		error = '';
		const currentUser = get(user);
		if (!currentUser) {
			error = 'User not authenticated.';
			return;
		}
		try {
			await apiKeys.addKey({ provider, key: apiKey.trim(), user_id: currentUser.id });
			apiKey = '';
			showToast('API key saved!');
		} catch (e) {
			error = 'Failed to add API key.';
		}
	}

	async function removeKey(id: string) {
		error = '';
		try {
			await apiKeys.deleteKey(id);
			showToast('API key deleted!');
		} catch (e) {
			error = 'Failed to delete API key.';
		}
	}

	function copyKey(key: string) {
		navigator.clipboard.writeText(key);
		showToast('API key copied!');
	}

	function startEdit(idx: number) {
		editingIndex = idx;
		editingKey = keys[idx].key;
	}

	async function saveEdit(idx: number) {
		error = '';
		try {
			await apiKeys.updateKey(keys[idx].id, { key: editingKey });
			editingIndex = null;
			editingKey = '';
			showToast('API key updated!');
		} catch (e) {
			error = 'Failed to update API key.';
		}
	}

	function cancelEdit() {
		editingIndex = null;
		editingKey = '';
	}

	function toggleShow(idx: number) {
		showKey[idx] = !showKey[idx];
	}

	function getProviderLabel(val: string) {
		return PROVIDERS.find((p) => p.value === val)?.label || val;
	}
</script>

<div class="flex w-full flex-col gap-4 p-4 sm:p-6">
	<Card class="w-full p-4 sm:p-6">
		<h2 class="mb-4 text-lg font-semibold">API Keys</h2>
		<div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
			<select
				bind:value={provider}
				class="w-full rounded border border-input bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-40"
			>
				{#each PROVIDERS as p}
					<option value={p.value}>{p.label}</option>
				{/each}
			</select>
			<Input
				type="text"
				bind:value={apiKey}
				placeholder="Paste your API key..."
				class="min-w-0 flex-1"
			/>
			<button
				class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
				on:click={addKey}
				disabled={!apiKey.trim() || !provider}
			>
				Save
			</button>
		</div>
		{#if error}
			<div class="text-xs text-red-600">{error}</div>
		{/if}
		<div>
			{#if keys.length === 0}
				<div class="text-muted-foreground">No API keys saved.</div>
				{console.log('[grid render] keys.length === 0, keys:', keys)}
			{:else}
				{console.log('[grid render] keys.length > 0, keys:', keys)}
				<div class="overflow-x-auto">
					<table class="w-full min-w-full border text-sm">
						<thead>
							<tr class="bg-muted">
								<th class="px-3 py-2 text-left font-semibold">Provider</th>
								<th class="px-3 py-2 text-left font-semibold">Key</th>
								<th class="px-3 py-2 text-left font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each keys as k, idx}
								<tr class="border-b">
									<td class="px-3 py-2">{getProviderLabel(k.provider)}</td>
									<td class="px-3 py-2">
										{#if editingIndex === idx}
											<Input type="text" bind:value={editingKey} class="w-full" />
										{:else}
											<span class="font-mono">
												{#if showKey[idx]}
													{k.key}
												{:else}
													{'*'.repeat(Math.min(24, k.key.length))}{k.key.length > 24 ? '...' : ''}
												{/if}
											</span>
										{/if}
									</td>
									<td class="flex gap-2 px-3 py-2">
										{#if editingIndex === idx}
											<button
												class="rounded bg-muted px-2 py-1 text-xs"
												on:click={() => saveEdit(idx)}>Save</button
											>
											<button class="rounded bg-muted px-2 py-1 text-xs" on:click={cancelEdit}
												>Cancel</button
											>
										{:else}
											<button
												class="rounded bg-muted px-2 py-1 text-xs"
												on:click={() => copyKey(k.key)}>Copy</button
											>
											<button
												class="rounded bg-muted px-2 py-1 text-xs"
												on:click={() => toggleShow(idx)}>{showKey[idx] ? 'Hide' : 'Show'}</button
											>
											<button
												class="rounded bg-muted px-2 py-1 text-xs"
												on:click={() => startEdit(idx)}>Edit</button
											>
											<button
												class="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
												on:click={() => removeKey(k.id)}>Delete</button
											>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</Card>
</div>

{#if toast}
	<div
		class="animate-fade-in fixed bottom-6 right-6 z-50 rounded bg-black/90 px-4 py-2 text-white shadow-lg"
	>
		{toast}
	</div>
{/if}

<style>
	.animate-fade-in {
		animation: fade-in 0.2s;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

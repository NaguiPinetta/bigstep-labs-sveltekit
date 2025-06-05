<script lang="ts">
	import { onMount } from 'svelte';
	import { Card } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem
	} from '$lib/components/ui/dropdown-menu/index.js';

	const PROVIDERS = [
		{ label: 'OpenAI (GPT)', value: 'openai' },
		{ label: 'Gemini', value: 'gemini' },
		{ label: 'DeepSeek', value: 'deepseek' }
	];

	let provider = PROVIDERS[0].value;
	let apiKey = '';
	let keys: { provider: string; key: string }[] = [];
	let editingIndex: number | null = null;
	let editingKey = '';
	let showKey: Record<number, boolean> = {};
	let toast = '';
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;

	function showToast(message: string) {
		toast = message;
		console.log('[toast] showToast called with:', message);
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => (toast = ''), 2000);
	}

	function saveKeys() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('llm_api_keys', JSON.stringify(keys));
			console.log('[saveKeys] keys saved to localStorage:', keys);
			// Re-read to ensure reactivity
			const loaded = JSON.parse(localStorage.getItem('llm_api_keys') || '[]');
			console.log('[saveKeys] keys loaded from localStorage after save:', loaded);
			keys = loaded;
			console.log('[saveKeys] keys after assignment:', keys);
		} else {
			console.log('[saveKeys] not running in browser, skipping localStorage');
		}
	}

	function loadKeys() {
		if (typeof window !== 'undefined') {
			const loaded = JSON.parse(localStorage.getItem('llm_api_keys') || '[]');
			console.log('[loadKeys] keys loaded from localStorage:', loaded);
			keys = loaded;
			console.log('[loadKeys] keys after assignment:', keys);
		} else {
			console.log('[loadKeys] not running in browser, skipping localStorage');
		}
	}

	function addKey() {
		console.log('[addKey] Save button clicked');
		if (!apiKey.trim()) return;
		keys = [...keys.filter((k) => k.provider !== provider), { provider, key: apiKey.trim() }];
		console.log('[addKey] keys before save:', keys);
		saveKeys();
		apiKey = '';
		console.log('[addKey] keys after save:', keys);
		showToast('API key saved!');
	}

	function removeKey(idx: number) {
		keys = keys.filter((_, i) => i !== idx);
		console.log('[removeKey] keys after removal:', keys);
		saveKeys();
		showToast('API key deleted!');
	}

	function copyKey(key: string) {
		navigator.clipboard.writeText(key);
		showToast('API key copied!');
	}

	function startEdit(idx: number) {
		editingIndex = idx;
		editingKey = keys[idx].key;
	}

	function saveEdit(idx: number) {
		keys[idx].key = editingKey;
		console.log('[saveEdit] keys after edit:', keys);
		saveKeys();
		editingIndex = null;
		editingKey = '';
		showToast('API key updated!');
	}

	function cancelEdit() {
		editingIndex = null;
		editingKey = '';
	}

	function toggleShow(idx: number) {
		showKey[idx] = !showKey[idx];
	}

	onMount(() => {
		loadKeys();
		console.log('[onMount] keys after loadKeys:', keys);
	});

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
				on:change={() => console.log('[select] provider changed to', provider)}
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
				on:click={() => {
					console.log('[native button] Save clicked');
					addKey();
				}}
				disabled={!apiKey.trim()}
			>
				Save
			</button>
		</div>
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
												on:click={() => removeKey(idx)}>Delete</button
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

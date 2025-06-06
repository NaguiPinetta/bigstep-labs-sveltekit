<script lang="ts">
	import { models, type ModelProfile } from '$lib/stores/models';
	import { onMount } from 'svelte';
	import { Card } from '$lib/components/ui/card/index.js';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetFooter,
		SheetClose
	} from '$lib/components/ui/sheet/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from '$lib/stores/toast';
	import { get } from 'svelte/store';
	import { user } from '$lib/stores/user';
	import { supabase } from '$lib/supabaseClient';

	let showForm = false;
	let editModel: ModelProfile | null = null;
	let showModel: ModelProfile | null = null;
	let modelList: ModelProfile[] = [];

	let form: Partial<ModelProfile> = {};
	let formError = '';

	let apiKeys: { id: string; provider: string; label: string }[] = [];
	let apiKeyError = '';

	const unsubscribe = models.subscribe((val) => (modelList = val));

	onMount(async () => {
		models.fetchModels();
		// Fetch real API keys for the current user
		const currentUser = get(user);
		if (!currentUser) return;
		const { data, error } = await supabase
			.from('api_keys')
			.select('id, provider')
			.eq('user_id', currentUser.id);
		if (error) {
			apiKeyError = 'Failed to load API keys.';
			console.error('[models] Error fetching API keys:', error);
			apiKeys = [];
			return;
		}
		apiKeys = (data || []).map((k) => ({
			id: k.id,
			provider: k.provider,
			label: `${k.provider} (${k.id.slice(0, 8)})`
		}));
	});

	function handleAdd() {
		editModel = null;
		form = { name: '', description: '', api_key_id: '', provider: '', system_prompt: '' };
		showForm = true;
	}

	function handleEdit(model: ModelProfile) {
		editModel = model;
		form = { ...model };
		showForm = true;
	}

	function handleShow(model: ModelProfile) {
		showModel = model;
	}

	function handleDelete(id: string) {
		if (confirm('Delete this model?')) {
			models.deleteModel(id);
		}
	}

	function handleFormSave() {
		formError = '';
		if (!form.name || !form.api_key_id || !form.system_prompt) {
			formError = 'Name, API Key, and System Prompt are required.';
			return;
		}
		const selectedKey = apiKeys.find((k) => k.id === form.api_key_id);
		if (!selectedKey) {
			formError = 'Please select a valid API Key.';
			return;
		}
		const currentUser = get(user);
		if (!currentUser) {
			formError = 'User not authenticated.';
			return;
		}
		const model = {
			name: form.name,
			description: form.description || '',
			api_key_id: form.api_key_id,
			provider: selectedKey.provider,
			system_prompt: form.system_prompt,
			user_id: currentUser.id
		};
		if (editModel) {
			models.updateModel(editModel.id, model);
		} else {
			models.addModel(model).then((error) => {
				if (error) {
					formError = error.message || 'Failed to add model.';
					return;
				}
				showForm = false;
				toast.set({ message: 'Model saved!', type: 'success' });
			});
			return;
		}
		showForm = false;
		toast.set({ message: 'Model saved!', type: 'success' });
	}

	let timeout: NodeJS.Timeout;
	$: if ($toast) {
		clearTimeout(timeout);
		timeout = setTimeout(() => toast.set(null), 2000);
	}
</script>

<div class="flex w-full flex-col gap-4 p-4 sm:p-6">
	{#if showForm}
		<Card class="mb-4 w-full p-4 sm:p-6">
			<form
				class="flex w-full flex-col items-start gap-4 text-left"
				on:submit|preventDefault={handleFormSave}
			>
				<h3 class="mb-2 text-left text-lg font-semibold">
					{editModel ? 'Edit Model' : 'Add Model'}
				</h3>
				<label class="block w-full text-left text-sm font-medium"
					>Name
					<Input type="text" bind:value={form.name} required class="mt-1 w-full" />
				</label>
				<label class="block w-full text-left text-sm font-medium"
					>Description
					<textarea
						bind:value={form.description}
						class="mt-1 min-h-[60px] w-full rounded border border-input bg-background p-2 text-sm"
					/>
				</label>
				<label class="block w-full text-left text-sm font-medium"
					>API Key / Provider
					<select
						bind:value={form.api_key_id}
						required
						class="mt-1 w-full rounded border border-input bg-background p-2 text-sm"
					>
						<option value="" disabled selected>Select an API Key</option>
						{#each apiKeys as key}
							<option value={key.id}>{key.label}</option>
						{/each}
					</select>
				</label>
				{#if apiKeyError}
					<div class="text-xs text-red-600">{apiKeyError}</div>
				{/if}
				<label class="block w-full text-left text-sm font-medium"
					>System Prompt
					<textarea
						bind:value={form.system_prompt}
						required
						class="mt-1 min-h-[80px] w-full rounded border border-input bg-background p-2 text-sm"
					/>
				</label>
				{#if formError}
					<div class="text-xs text-red-600">{formError}</div>
				{/if}
				<div class="mt-2 flex gap-2">
					<button
						type="submit"
						class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>Save</button
					>
					<button
						type="button"
						class="rounded bg-muted px-4 py-2 text-sm"
						on:click={() => (showForm = false)}>Cancel</button
					>
				</div>
			</form>
		</Card>
	{/if}
	<Card class="w-full p-4 sm:p-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Models</h2>
			<button
				class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				on:click={handleAdd}
			>
				Add Model
			</button>
		</div>
		<div>
			{#if modelList.length === 0}
				<div class="text-muted-foreground">No models saved.</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full min-w-full border text-sm">
						<thead>
							<tr class="bg-muted">
								<th class="px-3 py-2 text-left font-semibold">Name</th>
								<th class="px-3 py-2 text-left font-semibold">Provider</th>
								<th class="px-3 py-2 text-left font-semibold">Description</th>
								<th class="px-3 py-2 text-left font-semibold">Prompt</th>
								<th class="px-3 py-2 text-left font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each modelList as model}
								<tr class="border-b">
									<td class="px-3 py-2 font-medium">{model.name}</td>
									<td class="px-3 py-2">{model.provider}</td>
									<td class="px-3 py-2">{model.description}</td>
									<td class="px-3 py-2"
										>{model.system_prompt.length > 32
											? model.system_prompt.slice(0, 32) + '...'
											: model.system_prompt}</td
									>
									<td class="flex gap-2 px-3 py-2">
										<button
											class="rounded bg-muted px-2 py-1 text-xs"
											on:click={() => handleShow(model)}>Show</button
										>
										<button
											class="rounded bg-muted px-2 py-1 text-xs"
											on:click={() => handleEdit(model)}>Edit</button
										>
										<button
											class="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
											on:click={() => handleDelete(model.id)}>Delete</button
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</Card>
	{#if $toast}
		<div class="fixed right-4 top-4 z-50 rounded bg-green-600 px-4 py-2 text-white shadow">
			{$toast.message}
		</div>
	{/if}
</div>

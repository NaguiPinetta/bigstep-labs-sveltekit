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

	// Dummy API keys for dropdown (replace with real store integration)
	const apiKeys = [
		{ id: 'openai-123', provider: 'OpenAI', label: 'OpenAI (GPT)' },
		{ id: 'gemini-456', provider: 'Gemini', label: 'Gemini' }
	];

	let showForm = false;
	let editModel: ModelProfile | null = null;
	let showModel: ModelProfile | null = null;
	let modelList: ModelProfile[] = [];

	let form: Partial<ModelProfile> = {};
	let formError = '';

	const unsubscribe = models.subscribe((val) => (modelList = val));

	onMount(() => {
		models.refresh();
	});

	function handleAdd() {
		editModel = null;
		form = { name: '', description: '', apiKeyId: '', provider: '', systemPrompt: '' };
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
		if (!form.name || !form.apiKeyId || !form.systemPrompt) {
			formError = 'Name, API Key, and System Prompt are required.';
			return;
		}
		const selectedKey = apiKeys.find((k) => k.id === form.apiKeyId);
		if (!selectedKey) {
			formError = 'Please select a valid API Key.';
			return;
		}
		const model: ModelProfile = {
			id: editModel?.id || `model-${Date.now()}`,
			name: form.name,
			description: form.description || '',
			apiKeyId: form.apiKeyId,
			provider: selectedKey.provider,
			systemPrompt: form.systemPrompt
		};
		if (editModel) {
			models.updateModel(model.id, model);
		} else {
			models.addModel(model);
		}
		models.refresh();
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
						bind:value={form.apiKeyId}
						required
						class="mt-1 w-full rounded border border-input bg-background p-2 text-sm"
					>
						<option value="" disabled selected>Select an API Key</option>
						{#each apiKeys as key}
							<option value={key.id}>{key.label}</option>
						{/each}
					</select>
				</label>
				<label class="block w-full text-left text-sm font-medium"
					>System Prompt
					<textarea
						bind:value={form.systemPrompt}
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
										>{model.systemPrompt.length > 32
											? model.systemPrompt.slice(0, 32) + '...'
											: model.systemPrompt}</td
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

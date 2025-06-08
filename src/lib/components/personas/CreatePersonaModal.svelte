<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	export let isOpen = false;
	export let closeModal: () => void;
	export let isEdit = false;
	export let personaToEdit: any = null;

	let name = '';
	let tone = '';
	let useCase = '';
	let systemPrompt = '';
	let error = '';

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (isEdit && personaToEdit) {
			name = personaToEdit.name || '';
			tone = personaToEdit.tone || '';
			useCase = personaToEdit.use_case || '';
			systemPrompt = personaToEdit.system_prompt || '';
		} else {
			name = '';
			tone = '';
			useCase = '';
			systemPrompt = '';
		}
	});

	function slugify(str: string) {
		return str
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9\-]/g, '');
	}

	async function submitPersona() {
		error = '';
		if (!name.trim()) {
			error = 'Persona name is required.';
			return;
		}
		const id = isEdit && personaToEdit ? personaToEdit.id : slugify(name);
		const persona = {
			id,
			name,
			tone,
			use_case: useCase,
			system_prompt: systemPrompt
		};
		// Save or update persona JSON
		// @ts-ignore - Cursor will handle file writing
		await writeFile(`/data/personas/${id}.json`, JSON.stringify(persona, null, 2));
		if (isEdit) {
			dispatch('edit', { persona });
		} else {
			dispatch('create', { persona });
		}
		closeModal();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">{isEdit ? 'Edit Persona' : 'Create Persona'}</h2>
				<button class="text-lg" on:click={closeModal}>&times;</button>
			</div>
			<form on:submit|preventDefault={submitPersona}>
				<div class="space-y-4">
					<label class="block">
						<span class="mb-1 block font-medium">Persona Name</span>
						<input class="w-full rounded border px-3 py-2" bind:value={name} required />
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Tone</span>
						<input
							class="w-full rounded border px-3 py-2"
							bind:value={tone}
							placeholder="e.g. formal, casual, neutral"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Use Case</span>
						<input
							class="w-full rounded border px-3 py-2"
							bind:value={useCase}
							placeholder="e.g. Support Agent, App Translator"
						/>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">System Prompt</span>
						<textarea
							class="w-full rounded border px-3 py-2"
							bind:value={systemPrompt}
							placeholder="Describe the assistant's behavior..."
						/>
					</label>
					{#if error}
						<div class="text-sm text-red-600">{error}</div>
					{/if}
					<button
						type="submit"
						class="w-full rounded bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
						>{isEdit ? 'Save Changes' : 'Create Persona'}</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}

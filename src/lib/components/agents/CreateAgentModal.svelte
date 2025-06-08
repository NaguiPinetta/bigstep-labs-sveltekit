<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	export let isOpen = false;
	export let closeModal: () => void;

	let name = '';
	let description = '';
	let modelProfileId = '';
	let personaId = '';
	let datasetIds: string[] = [];
	let toolset: string[] = [];
	let outputFormat = 'json';

	let modelProfiles: { id: string; name: string }[] = [];
	let personas: { id: string; name: string }[] = [];
	let datasets: { id: string; name: string }[] = [];

	let error = '';

	const dispatch = createEventDispatcher();

	onMount(async () => {
		modelProfiles = [
			{ id: 'gpt-4', name: 'GPT-4' },
			{ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
		];
		personas = [
			{ id: 'translator-casual', name: 'Translator Casual' },
			{ id: 'qa-bot', name: 'QA Bot' }
		];
		datasets = [
			{ id: 'news-corpus', name: 'News Corpus' },
			{ id: 'product-faq', name: 'Product FAQ' }
		];
	});

	function slugify(str: string) {
		return str
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9\-]/g, '');
	}

	async function saveAgent(agent: any) {
		const path = `/data/agents/${agent.id}.json`;
		// @ts-ignore - Cursor will handle file existence check and creation
		if (await fileExists(path)) {
			error = 'Agent with this name/id already exists.';
			return false;
		}
		// @ts-ignore - Cursor will handle file creation
		await writeFile(path, JSON.stringify(agent, null, 2));
		return true;
	}

	async function submitAgent() {
		error = '';
		if (!name.trim()) {
			error = 'Agent name is required.';
			return;
		}
		const id = slugify(name);
		// @ts-ignore - Cursor will handle file existence check
		if (await fileExists(`/data/agents/${id}.json`)) {
			error = 'Agent with this name/id already exists.';
			return;
		}
		const newAgent = {
			id,
			name,
			description,
			model_profile_id: modelProfileId,
			persona_id: personaId,
			dataset_ids: datasetIds,
			toolset,
			output_format: outputFormat
		};
		const ok = await saveAgent(newAgent);
		if (ok) {
			dispatch('create', { agent: newAgent });
			closeModal();
		}
	}

	function toggleDataset(id: string) {
		if (datasetIds.includes(id)) {
			datasetIds = datasetIds.filter((d) => d !== id);
		} else {
			datasetIds = [...datasetIds, id];
		}
	}
	function toggleTool(tool: string) {
		if (toolset.includes(tool)) {
			toolset = toolset.filter((t) => t !== tool);
		} else {
			toolset = [...toolset, tool];
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="w-full max-w-lg rounded-lg bg-card p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Create New Agent</h2>
				<button class="text-lg" on:click={closeModal}>&times;</button>
			</div>
			<form on:submit|preventDefault={submitAgent}>
				<div class="space-y-4">
					<label class="block">
						<span class="mb-1 block font-medium">Agent Name</span>
						<input class="w-full rounded border px-3 py-2" bind:value={name} required />
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Description</span>
						<textarea class="w-full rounded border px-3 py-2" bind:value={description} rows="2" />
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Model Profile</span>
						<select class="w-full rounded border px-3 py-2" bind:value={modelProfileId} required>
							<option value="" disabled selected>Select a model...</option>
							{#each modelProfiles as model}
								<option value={model.id}>{model.name}</option>
							{/each}
						</select>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Persona</span>
						<select class="w-full rounded border px-3 py-2" bind:value={personaId}>
							<option value="" disabled selected>Select a persona...</option>
							{#each personas as persona}
								<option value={persona.id}>{persona.name}</option>
							{/each}
						</select>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Datasets</span>
						<div class="flex flex-wrap gap-2">
							{#each datasets as dataset}
								<label class="flex items-center gap-2">
									<input
										type="checkbox"
										value={dataset.id}
										checked={datasetIds.includes(dataset.id)}
										on:change={() => toggleDataset(dataset.id)}
									/>
									{dataset.name}
								</label>
							{/each}
						</div>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Toolset</span>
						<div class="flex flex-wrap gap-2">
							<label class="flex items-center gap-2">
								<input
									type="checkbox"
									value="glossary"
									checked={toolset.includes('glossary')}
									on:change={() => toggleTool('glossary')}
								/> Glossary
							</label>
							<label class="flex items-center gap-2">
								<input
									type="checkbox"
									value="tm_lookup"
									checked={toolset.includes('tm_lookup')}
									on:change={() => toggleTool('tm_lookup')}
								/> TM Lookup
							</label>
							<label class="flex items-center gap-2">
								<input
									type="checkbox"
									value="rag"
									checked={toolset.includes('rag')}
									on:change={() => toggleTool('rag')}
								/> RAG
							</label>
						</div>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Output Format</span>
						<select class="w-full rounded border px-3 py-2" bind:value={outputFormat} required>
							<option value="json">JSON</option>
							<option value="markdown">Markdown</option>
							<option value="plain">Plain</option>
						</select>
					</label>
					{#if error}
						<div class="text-sm text-red-600">{error}</div>
					{/if}
					<button
						type="submit"
						class="w-full rounded bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
						>Create Agent</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}

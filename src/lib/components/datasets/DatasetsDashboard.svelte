<script lang="ts">
	import { onMount } from 'svelte';
	import UploadDatasetModal from './UploadDatasetModal.svelte';

	type Dataset = {
		id: string;
		name: string;
		type: string;
		file: string;
		linked_agents?: string[];
	};

	let datasets: Dataset[] = [];
	let showUploadModal = false;

	// Use provided mock data
	onMount(() => {
		datasets = [
			{
				id: 'glossary-v3',
				name: 'Glossary v3',
				type: 'glossary',
				file: 'glossary-v3.csv',
				linked_agents: ['translator-glossary-v3', 'release-note-bot']
			},
			{
				id: 'product-faq',
				name: 'Product FAQ Corpus',
				type: 'corpus',
				file: 'faq-docs.txt',
				linked_agents: ['support-bot']
			},
			{
				id: 'tm-2025',
				name: 'Translation Memory 2025',
				type: 'tmx',
				file: 'tm_2025.tmx',
				linked_agents: ['translator-glossary-v3']
			}
		];
		console.log('[DatasetsDashboard] datasets loaded:', datasets);
	});

	function openUploadModal() {
		showUploadModal = true;
	}
	function closeUploadModal() {
		showUploadModal = false;
	}
	function handleUpload(event: CustomEvent) {
		const dataset = event.detail.dataset;
		datasets = [...datasets, dataset];
		showUploadModal = false;
	}
	function viewDataset(dataset: Dataset) {
		// TODO: View or preview dataset
		alert('View: ' + dataset.name);
	}
	function deleteDataset(id: string) {
		if (confirm('Delete this dataset?')) {
			datasets = datasets.filter((d) => d.id !== id);
		}
	}
</script>

<div class="mt-8 w-full rounded-lg border bg-card p-6 shadow-sm">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Datasets</h2>
		<button
			class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			on:click={openUploadModal}
		>
			+ Upload Dataset
		</button>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border text-sm">
			<thead>
				<tr class="bg-muted">
					<th class="px-4 py-2 text-left font-semibold">Name</th>
					<th class="px-4 py-2 text-left font-semibold">Type</th>
					<th class="px-4 py-2 text-left font-semibold">Used By</th>
					<th class="px-4 py-2 text-left font-semibold">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each datasets as dataset}
					<tr class="border-b">
						<td class="whitespace-nowrap px-4 py-2 font-medium">{dataset.name}</td>
						<td class="whitespace-nowrap px-4 py-2">{dataset.type}</td>
						<td class="whitespace-nowrap px-4 py-2">{dataset.linked_agents?.length || 0}</td>
						<td class="flex gap-2 px-4 py-2">
							<button
								class="rounded bg-muted px-2 py-1 text-xs"
								on:click={() => viewDataset(dataset)}>View</button
							>
							<button
								class="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
								on:click={() => deleteDataset(dataset.id)}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<UploadDatasetModal
	isOpen={showUploadModal}
	closeModal={closeUploadModal}
	on:upload={handleUpload}
/>

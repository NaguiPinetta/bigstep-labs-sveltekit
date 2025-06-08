<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let isOpen = false;
	export let closeModal: () => void;

	let name = '';
	let type = 'glossary';
	let file: File | null = null;
	let error = '';

	const dispatch = createEventDispatcher();

	function slugify(str: string) {
		return str
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9\-]/g, '');
	}

	async function submitUpload() {
		error = '';
		if (!name.trim()) {
			error = 'Dataset name is required.';
			return;
		}
		if (!file) {
			error = 'Please select a file to upload.';
			return;
		}
		const id = slugify(name);
		const ext = file.name.split('.').pop();
		const filename = `${id}.${ext}`;
		// Save file to /data/datasets/[filename]
		// @ts-ignore - Cursor will handle file writing
		await writeFile(`/data/datasets/${filename}`, await file.arrayBuffer());
		// Create metadata JSON
		const metadata = {
			id,
			name,
			type,
			file: filename,
			linked_agents: []
		};
		// @ts-ignore - Cursor will handle file writing
		await writeFile(`/data/datasets/${id}.json`, JSON.stringify(metadata, null, 2));
		dispatch('upload', { dataset: metadata });
		closeModal();
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		file = input.files && input.files[0] ? input.files[0] : null;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Upload Dataset</h2>
				<button class="text-lg" on:click={closeModal}>&times;</button>
			</div>
			<form on:submit|preventDefault={submitUpload}>
				<div class="space-y-4">
					<label class="block">
						<span class="mb-1 block font-medium">Dataset Name</span>
						<input class="w-full rounded border px-3 py-2" bind:value={name} required />
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Type</span>
						<select class="w-full rounded border px-3 py-2" bind:value={type} required>
							<option value="glossary">Glossary</option>
							<option value="corpus">Corpus</option>
							<option value="tm">Translation Memory</option>
						</select>
					</label>
					<label class="block">
						<span class="mb-1 block font-medium">Upload File</span>
						<input
							type="file"
							class="w-full"
							accept=".csv,.txt,.tmx"
							on:change={handleFileChange}
							required
						/>
					</label>
					{#if error}
						<div class="text-sm text-red-600">{error}</div>
					{/if}
					<button
						type="submit"
						class="w-full rounded bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
						>Upload</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}

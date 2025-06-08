<script lang="ts">
	import { onMount } from 'svelte';

	// SHADCN-style card and button classes
	// Replace with actual SHADCN components if available

	type ModelProfile = {
		id: string;
		name: string;
		base_model: string;
		temperature?: number;
		max_tokens?: number;
		system_prompt?: string;
	};

	let modelProfiles: ModelProfile[] = [];

	// Mock data for now
	onMount(async () => {
		modelProfiles = [
			{
				id: 'gpt-4o-profile',
				name: 'GPT-4o Support',
				base_model: 'gpt-4o',
				temperature: 0.7,
				max_tokens: 1024,
				system_prompt: 'You are a helpful assistant trained on support documentation...'
			},
			{
				id: 'gpt-3.5-profile',
				name: 'GPT-3.5 General',
				base_model: 'gpt-3.5-turbo',
				temperature: 0.5,
				max_tokens: 512,
				system_prompt: 'You are a general-purpose assistant.'
			}
		];
	});

	function openCreateModelModal() {
		// TODO: Open modal for creating a new model profile
		alert('Open create model modal');
	}
	function openEditModel(profile: ModelProfile) {
		// TODO: Open modal for editing the selected model profile
		alert('Edit: ' + profile.name);
	}
	function deleteModel(id: string) {
		if (confirm('Delete this model profile?')) {
			modelProfiles = modelProfiles.filter((m) => m.id !== id);
		}
	}
	function truncate(text: string, length: number): string {
		return text && text.length > length ? text.slice(0, length) + '...' : text;
	}
</script>

<div class="mx-auto mt-8 max-w-4xl rounded-lg border bg-card p-6 shadow-sm">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Model Profiles</h2>
		<button
			class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			on:click={openCreateModelModal}
		>
			+ Add Model Profile
		</button>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full min-w-full border text-sm">
			<thead>
				<tr class="bg-muted">
					<th class="px-3 py-2 text-left font-semibold">Name</th>
					<th class="px-3 py-2 text-left font-semibold">Base Model</th>
					<th class="px-3 py-2 text-left font-semibold">Prompt</th>
					<th class="px-3 py-2 text-left font-semibold">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each modelProfiles as model}
					<tr class="border-b">
						<td class="px-3 py-2 font-medium">{model.name}</td>
						<td class="px-3 py-2">{model.base_model}</td>
						<td class="px-3 py-2">{truncate(model.system_prompt || '', 60)}</td>
						<td class="flex gap-2 px-3 py-2">
							<button
								class="rounded bg-muted px-2 py-1 text-xs"
								on:click={() => openEditModel(model)}>Edit</button
							>
							<button
								class="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
								on:click={() => deleteModel(model.id)}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

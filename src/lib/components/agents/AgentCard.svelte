<script lang="ts">
	export let agent: {
		name: string;
		description: string;
		model: string;
		datasets: string[];
		persona: string;
	};
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">{agent.name}</h2>
		<span class="text-xs text-muted-foreground">{agent.persona}</span>
	</div>
	<div class="text-sm text-muted-foreground">{agent.description}</div>
	<div class="flex flex-wrap gap-2 text-xs">
		<span class="rounded bg-muted px-2 py-1">Model: {agent.model}</span>
		<span class="rounded bg-muted px-2 py-1">Datasets: {agent.datasets.length}</span>
	</div>
	<div class="mt-2 flex gap-2">
		<button class="rounded bg-muted px-3 py-1 text-xs" on:click={() => dispatch('edit')}
			>Edit</button
		>
		<button
			class="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
			on:click={() => dispatch('run')}>Run in Assistant</button
		>
	</div>
</div>

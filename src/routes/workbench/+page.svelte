<script lang="ts">
	import { onMount } from 'svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	// Mock TranslateCSVPanel
	const TranslateCSVPanel = (props: { selectedAgentId: string }) => ({
		$$render: () =>
			`<div class='rounded-lg border bg-card p-4 mt-4'><p>Task: Translate CSV with Agent ${props.selectedAgentId}</p><p>Upload a CSV file and see results here.</p></div>`
	});

	type Agent = { id: string; name: string };
	let selectedTask = '';
	let selectedAgentId = '';
	let agents: Agent[] = [];

	// Mock agent data for now
	onMount(() => {
		agents = [
			{ id: 'content-summarizer', name: 'Content Summarizer' },
			{ id: 'qa-bot', name: 'QA Bot' }
		];
	});
</script>

<div class="mx-auto mt-8 w-full max-w-3xl">
	<div class="rounded-lg border bg-card shadow-sm">
		<div class="border-b px-6 py-4">
			<h2 class="text-xl font-semibold">Workbench</h2>
			<p class="text-sm text-muted-foreground">Run structured tasks using your agents.</p>
		</div>
		<div class="px-6">
			<div class="space-y-4 py-6">
				<div class="space-y-2">
					<Label for="task-select">Task</Label>
					<select
						id="task-select"
						class="w-full rounded border px-3 py-2"
						bind:value={selectedTask}
					>
						<option disabled selected value="">Select a task</option>
						<option value="translate_csv">Translate CSV (Glossary)</option>
						<option value="summarize_doc">Summarize Document</option>
						<option value="rewrite_text">Rewrite Text with Persona</option>
						<option value="glossary_qa">Glossary QA Check</option>
					</select>
				</div>
				<div class="space-y-2">
					<Label for="agent-select">Agent</Label>
					<select
						id="agent-select"
						class="w-full rounded border px-3 py-2"
						bind:value={selectedAgentId}
					>
						<option disabled selected value="">Select an agent</option>
						{#each agents as agent}
							<option value={agent.id}>{agent.name}</option>
						{/each}
					</select>
				</div>
				<!-- Task Panel (dynamic) -->
				{#if selectedTask === 'translate_csv'}
					{@html TranslateCSVPanel({ selectedAgentId }).$$render()}
				{:else if selectedTask === 'summarize_doc'}
					<div class="mt-4 rounded-lg border bg-card p-4">SummarizeDocPanel (coming soon)</div>
				{:else if selectedTask === 'rewrite_text'}
					<div class="mt-4 rounded-lg border bg-card p-4">RewriteTextPanel (coming soon)</div>
				{:else if selectedTask === 'glossary_qa'}
					<div class="mt-4 rounded-lg border bg-card p-4">GlossaryQACheckPanel (coming soon)</div>
				{/if}
			</div>
		</div>
	</div>
</div>

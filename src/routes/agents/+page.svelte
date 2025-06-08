<script lang="ts">
	import AgentCard from '$lib/components/agents/AgentCard.svelte';
	import { goto } from '$app/navigation';
	import CreateAgentModal from '$lib/components/agents/CreateAgentModal.svelte';

	// Mock agent data
	type Agent = {
		id?: string;
		name: string;
		description: string;
		model: string;
		model_profile_id?: string;
		persona: string;
		persona_id?: string;
		datasets: string[];
		dataset_ids?: string[];
		toolset?: string[];
		output_format?: string;
	};
	let agents: Agent[] = [
		{
			name: 'Content Summarizer',
			description: 'Summarizes articles and documents.',
			model: 'gpt-4',
			datasets: ['News Corpus', 'Tech Articles'],
			persona: 'Professional'
		},
		{
			name: 'QA Bot',
			description: 'Answers product questions.',
			model: 'gpt-3.5-turbo',
			datasets: ['Product FAQ'],
			persona: 'Friendly'
		}
	];

	let showCreateModal = false;

	function handleEdit(agent: Agent) {
		// Placeholder for edit logic
		alert('Edit: ' + agent.name);
	}
	function handleRun(agent: Agent) {
		// Placeholder for run logic
		alert('Run: ' + agent.name);
	}
	function handleCreate() {
		showCreateModal = true;
	}
	function closeCreateModal() {
		showCreateModal = false;
	}

	function addAgentToList(event: CustomEvent) {
		const agent = event.detail.agent;
		// For display, map model_profile_id/model/persona_id/persona/dataset_ids/datasets as needed
		agents = [
			...agents,
			{
				...agent,
				model: agent.model_profile_id || agent.model || '',
				persona: agent.persona_id || agent.persona || '',
				datasets: agent.dataset_ids || agent.datasets || []
			}
		];
		showCreateModal = false;
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Agents</h1>
		<button
			class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			on:click={handleCreate}
		>
			Create Agent
		</button>
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each agents as agent}
			<AgentCard {agent} on:edit={() => handleEdit(agent)} on:run={() => handleRun(agent)} />
		{/each}
	</div>
	<CreateAgentModal
		isOpen={showCreateModal}
		closeModal={closeCreateModal}
		on:create={addAgentToList}
	/>
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import CreatePersonaModal from './CreatePersonaModal.svelte';

	type Persona = {
		id: string;
		name: string;
		tone: string;
		use_case: string;
		system_prompt?: string;
	};

	let personas: Persona[] = [];
	let showCreateModal = false;
	let personaToEdit = null;

	// Mock data for now
	onMount(() => {
		personas = [
			{
				id: 'translator-casual',
				name: 'Translator Casual',
				tone: 'informal',
				use_case: 'Mobile App UI',
				system_prompt:
					'You are a casual, friendly translator who helps adapt microcopy for mobile users.'
			},
			{
				id: 'support-agent-formal',
				name: 'Support Agent (Formal)',
				tone: 'formal',
				use_case: 'Customer Support',
				system_prompt: 'You are a formal, professional support agent.'
			}
		];
	});

	function openCreatePersonaModal() {
		showCreateModal = true;
		personaToEdit = null;
	}
	function closeCreateModal() {
		showCreateModal = false;
		personaToEdit = null;
	}
	function handleCreate(event: CustomEvent) {
		const persona = event.detail.persona;
		personas = [...personas, persona];
		showCreateModal = false;
	}
	function editPersona(persona: Persona) {
		// TODO: Open modal for editing the selected persona
		alert('Edit: ' + persona.name);
	}
	function deletePersona(id: string) {
		if (confirm('Delete this persona?')) {
			personas = personas.filter((p) => p.id !== id);
		}
	}
</script>

<div class="mt-8 w-full rounded-lg border bg-card p-6 shadow-sm">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Personas</h2>
		<button
			class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			on:click={openCreatePersonaModal}
		>
			+ Create Persona
		</button>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border text-sm">
			<thead>
				<tr class="bg-muted">
					<th class="px-4 py-2 text-left font-semibold">Name</th>
					<th class="px-4 py-2 text-left font-semibold">Tone</th>
					<th class="px-4 py-2 text-left font-semibold">Use Case</th>
					<th class="px-4 py-2 text-left font-semibold">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each personas as persona}
					<tr class="border-b">
						<td class="whitespace-nowrap px-4 py-2 font-medium">{persona.name}</td>
						<td class="whitespace-nowrap px-4 py-2">{persona.tone}</td>
						<td class="whitespace-nowrap px-4 py-2">{persona.use_case}</td>
						<td class="flex gap-2 px-4 py-2">
							<button
								class="rounded bg-muted px-2 py-1 text-xs"
								on:click={() => editPersona(persona)}>Edit</button
							>
							<button
								class="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
								on:click={() => deletePersona(persona.id)}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<CreatePersonaModal
	isOpen={showCreateModal}
	closeModal={closeCreateModal}
	on:create={handleCreate}
/>

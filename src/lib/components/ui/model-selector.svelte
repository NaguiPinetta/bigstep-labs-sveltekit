<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import type { LLMModel } from '$lib/server/llm';
	import { selectedModelId, customPrompt } from '$lib/stores/assistant';

	export let models: LLMModel[] = [];

	let localModelId = 'gpt-3.5-turbo';
	let localPrompt = 'You are a helpful assistant.';
	let saved = false;

	// On mount, initialize local state from localStorage or stores
	if (typeof localStorage !== 'undefined') {
		localModelId = localStorage.getItem('selectedModelId') || 'gpt-3.5-turbo';
		localPrompt = localStorage.getItem('customPrompt') || 'You are a helpful assistant.';
	}
	selectedModelId.subscribe((id) => {
		localModelId = id;
	});
	customPrompt.subscribe((val) => {
		localPrompt = val;
	});

	function selectModel(id: string) {
		localModelId = id;
	}
	function updatePrompt(e: Event) {
		localPrompt = (e.target as HTMLTextAreaElement).value;
	}
	function saveConfig() {
		selectedModelId.set(localModelId);
		customPrompt.set(localPrompt);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('selectedModelId', localModelId);
			localStorage.setItem('customPrompt', localPrompt);
		}
		saved = true;
		setTimeout(() => (saved = false), 1500);
	}
</script>

<Card.Card class="mx-auto mt-8 max-w-xl">
	<Card.CardHeader>
		<Card.CardTitle>Selecionar Modelo</Card.CardTitle>
		<Card.CardDescription>
			Escolha o modelo de linguagem que deseja usar para o assistente.
		</Card.CardDescription>
	</Card.CardHeader>
	<Card.CardContent>
		<div class="flex flex-col gap-4">
			{#each models as model}
				<label class="flex cursor-pointer items-center gap-3 rounded p-2 transition hover:bg-muted">
					<input
						type="radio"
						name="model"
						value={model.id}
						checked={localModelId === model.id}
						on:change={() => selectModel(model.id)}
						class="accent-primary"
					/>
					<div class="flex flex-col">
						<span class="font-medium">{model.name}</span>
						<span class="text-xs text-muted-foreground">{model.description}</span>
					</div>
				</label>
			{/each}
			<div class="mt-4 flex flex-col gap-2">
				<label for="customPrompt" class="font-medium">Prompt do Assistente (Role/Objetivo)</label>
				<textarea
					id="customPrompt"
					class="min-h-[80px] rounded border border-input bg-background p-2 text-sm"
					bind:value={localPrompt}
					on:input={updatePrompt}
					placeholder="Defina o papel e objetivo do assistente..."
				/>
			</div>
		</div>
	</Card.CardContent>
	<Card.CardFooter>
		<Button.Button class="w-full" on:click={saveConfig}>Salvar</Button.Button>
		{#if saved}
			<span class="ml-4 font-medium text-green-600">Salvo!</span>
		{/if}
	</Card.CardFooter>
</Card.Card>

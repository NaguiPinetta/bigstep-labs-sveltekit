<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Input from '$lib/components/ui/input/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Skeleton from '$lib/components/ui/skeleton/index.js';
	import { selectedModelId, customPrompt } from '$lib/stores/assistant';
	import { models, type ModelProfile } from '$lib/stores/models';
	import { history } from '$lib/stores/history';

	let messages: { role: 'user' | 'assistant'; content: string; timestamp?: string }[] = [];
	let inputMessage = '';
	let isLoading = false;
	let chatContainer: HTMLDivElement | null = null;

	let modelId = 'gpt-3.5-turbo';
	let systemPrompt = 'You are a helpful assistant.';
	let modelProfiles: ModelProfile[] = [];
	let sessionStart: string = new Date().toISOString();

	selectedModelId.subscribe((id: string) => {
		modelId = id;
	});
	customPrompt.subscribe((val) => {
		systemPrompt = val;
	});
	models.subscribe((val) => (modelProfiles = val));

	const user = {
		name: 'shadcn',
		avatar: '/avatars/shadcn.jpg'
	};
	const assistant = {
		name: 'Assistant',
		avatar: '/bot-avatar.png' // You can provide a bot avatar or fallback
	};

	function saveSession() {
		if (messages.length < 2) return; // Only save if at least one user and one assistant message
		const userMsg = messages.find((m) => m.role === 'user');
		const assistantMsg = messages.find((m) => m.role === 'assistant');
		if (!userMsg || !assistantMsg) return;
		history.addSession({
			id: `session-${Date.now()}`,
			started: sessionStart,
			modelId,
			modelName: modelProfiles.find((m) => m.id === modelId)?.name || modelId,
			messages: messages.map((m) => ({ ...m, timestamp: m.timestamp || new Date().toISOString() }))
		});
		// Reset sessionStart for next session if needed
		sessionStart = new Date().toISOString();
	}

	async function handleSubmit() {
		if (!inputMessage.trim()) return;

		const userMessage = inputMessage;
		inputMessage = '';
		messages = [
			...messages,
			{
				role: 'user',
				content: userMessage,
				timestamp: new Date().toISOString()
			}
		];
		isLoading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					prompt: userMessage,
					history: messages,
					modelId,
					customPrompt: systemPrompt
				})
			});

			const data = await response.json();
			messages = [
				...messages,
				{
					role: 'assistant',
					content: data.reply,
					timestamp: new Date().toISOString()
				}
			];
			saveSession();
		} catch (error) {
			console.error('Error:', error);
			messages = [
				...messages,
				{
					role: 'assistant',
					content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
					timestamp: new Date().toISOString()
				}
			];
		} finally {
			isLoading = false;
		}
	}

	function handleModelChange(e: Event) {
		const id = (e.target as HTMLSelectElement).value;
		const model = modelProfiles.find((m) => m.id === id);
		if (model) {
			selectedModelId.set(model.id);
			customPrompt.set(model.systemPrompt);
		}
	}

	$: if (chatContainer) {
		console.log('Reactive scroll fired');
		console.log('chatContainer:', chatContainer);
		console.log('messages.length:', messages.length);
		console.log('scrollHeight:', chatContainer.scrollHeight, 'scrollTop:', chatContainer.scrollTop);
		chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
	}

	onMount(() => {
		console.log('Selected Model:', $selectedModelId);
		console.log('Custom Prompt:', $customPrompt);
	});
</script>

<div class="flex min-h-0 flex-1 flex-col">
	<!-- Chat header with model selector -->
	<div class="mx-auto mb-2 w-full max-w-2xl">
		<div
			class="flex flex-col gap-2 rounded-t-md border-b border-border bg-card px-4 py-2 sm:flex-row sm:items-center sm:justify-between"
		>
			<h2 class="text-left text-lg font-semibold">Chat</h2>
			{#if modelProfiles.length > 0}
				<div class="flex w-full items-center gap-2 sm:w-auto">
					<label for="model-select" class="text-sm font-medium">Model:</label>
					<select
						id="model-select"
						class="w-full rounded border border-input bg-background p-1 text-sm sm:w-auto"
						bind:value={modelId}
						on:change={handleModelChange}
					>
						{#each modelProfiles as model}
							<option value={model.id}>{model.name}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>
	</div>
	<!-- Chat area -->
	<div bind:this={chatContainer} class="flex-1 space-y-4 overflow-y-auto bg-background p-4">
		{#each messages as message}
			<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
				<Card.Card
					class="flex w-fit max-w-[80%] items-end gap-2 p-2 {message.role === 'user'
						? 'ml-auto bg-primary text-primary-foreground'
						: 'bg-card text-card-foreground'}"
				>
					{#if message.role === 'assistant'}
						<Avatar.Avatar class="size-8">
							<Avatar.AvatarImage src={assistant.avatar} alt={assistant.name} />
							<Avatar.AvatarFallback>A</Avatar.AvatarFallback>
						</Avatar.Avatar>
					{/if}
					<span class="whitespace-pre-line break-words">{message.content}</span>
					{#if message.role === 'user'}
						<Avatar.Avatar class="size-8">
							<Avatar.AvatarImage src={user.avatar} alt={user.name} />
							<Avatar.AvatarFallback>U</Avatar.AvatarFallback>
						</Avatar.Avatar>
					{/if}
				</Card.Card>
			</div>
			<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
				<span
					class="mt-1 text-xs text-muted-foreground {message.role === 'user'
						? 'text-right'
						: 'text-left'}"
				>
					{#if message.timestamp}
						{new Date(message.timestamp).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}
					{/if}
					{' '}
					<span class="ml-2">{message.role === 'user' ? 'Sent' : 'Received'}</span>
				</span>
			</div>
		{/each}
		{#if isLoading}
			<div class="flex justify-start">
				<Card.Card
					class="flex w-fit max-w-[80%] items-center gap-2 bg-card p-2 text-card-foreground"
				>
					<Avatar.Avatar class="size-8">
						<Avatar.AvatarImage src={assistant.avatar} alt={assistant.name} />
						<Avatar.AvatarFallback>A</Avatar.AvatarFallback>
					</Avatar.Avatar>
					<div class="flex gap-1">
						<Skeleton.Skeleton class="h-2 w-2 rounded-full" />
						<Skeleton.Skeleton class="h-2 w-2 rounded-full" style="animation-delay: 0.1s;" />
						<Skeleton.Skeleton class="h-2 w-2 rounded-full" style="animation-delay: 0.2s;" />
					</div>
				</Card.Card>
			</div>
		{/if}
	</div>

	<form on:submit|preventDefault={handleSubmit} class="shrink-0 border-t border-border bg-card p-4">
		<div class="flex gap-2">
			<Input.Input
				type="text"
				bind:value={inputMessage}
				placeholder="Digite sua mensagem..."
				class="flex-1"
			/>
			<Button.Button type="submit" disabled={isLoading}>Enviar</Button.Button>
		</div>
	</form>
</div>

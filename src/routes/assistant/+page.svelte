<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Input from '$lib/components/ui/input/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Skeleton from '$lib/components/ui/skeleton/index.js';
	import { selectedModelId, customPrompt } from '$lib/stores/assistant';

	let messages: { role: 'user' | 'assistant'; content: string; timestamp?: string }[] = [];
	let inputMessage = '';
	let isLoading = false;
	let chatContainer: HTMLDivElement | null = null;

	let modelId = 'gpt-3.5-turbo';
	let systemPrompt = 'You are a helpful assistant.';

	selectedModelId.subscribe((id: string) => {
		modelId = id;
	});
	customPrompt.subscribe((val) => {
		systemPrompt = val;
	});

	const user = {
		name: 'shadcn',
		avatar: '/avatars/shadcn.jpg'
	};
	const assistant = {
		name: 'Assistant',
		avatar: '/bot-avatar.png' // You can provide a bot avatar or fallback
	};

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

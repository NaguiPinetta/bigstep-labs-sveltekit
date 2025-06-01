<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	let messages: { role: 'user' | 'assistant'; text: string }[] = [];
	let inputText = '';
	let loading = false;

	async function sendMessage() {
		if (!inputText.trim()) return;

		messages = [...messages, { role: 'user', text: inputText }];
		const payload = { prompt: inputText, history: [] };

		loading = true;
		const res = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: { 'Content-Type': 'application/json' }
		});
		const data = await res.json();
		loading = false;

		messages = [...messages, { role: 'assistant', text: data.reply }];
		inputText = '';
	}
</script>

<section class="mx-auto max-w-2xl space-y-4 p-6">
	<h1 class="text-2xl font-bold">BigStep Conversation Assistant</h1>

	<div class="h-[400px] space-y-2 overflow-y-auto rounded-md border bg-white p-4 shadow">
		{#each messages as msg}
			<div
				class="max-w-[90%] rounded px-3 py-2 {msg.role === 'user'
					? 'ml-auto bg-blue-100'
					: 'bg-gray-100'}"
			>
				<strong>{msg.role === 'user' ? 'Você' : 'Assistente'}:</strong>
				<p class="mt-1 whitespace-pre-wrap">{msg.text}</p>
			</div>
		{/each}

		{#if loading}
			<div class="text-sm italic text-gray-500">Gerando resposta…</div>
		{/if}
	</div>

	<div class="flex gap-2">
		<Textarea bind:value={inputText} placeholder="Digite sua resposta..." class="flex-1" />
		<Button on:click={sendMessage} disabled={loading}>Enviar</Button>
	</div>
</section>

<!-- TODO: Paste the chat interface code here as instructed. -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { history, type ChatSession } from '$lib/stores/history';
	import { Card } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { goto } from '$app/navigation';

	let sessions: ChatSession[] = [];
	let selectedSession: ChatSession | null = null;
	let showModal = false;
	let search = '';

	const unsubscribe = history.subscribe((val) => {
		sessions = val
			.slice()
			.sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime());
	});

	onMount(() => {
		history.refresh();
	});

	function getPreview(session: ChatSession) {
		if (!session.messages.length) return '';
		// Use the latest message for preview
		const last = session.messages[session.messages.length - 1];
		return last.content.length > 48 ? last.content.slice(0, 48) + '...' : last.content;
	}

	function openSession(session: ChatSession) {
		selectedSession = session;
		showModal = true;
	}
	function closeModal() {
		showModal = false;
		selectedSession = null;
	}

	function handleDelete(sessionId: string) {
		if (confirm('Delete this session?')) {
			history.deleteSession(sessionId);
			if (selectedSession && selectedSession.id === sessionId) {
				selectedSession = null;
				showModal = false;
			}
		}
	}

	function exportSession(session: ChatSession, type: 'json' | 'md') {
		if (type === 'json') {
			const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `chat-session-${session.id}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} else if (type === 'md') {
			let md = `# Chat Session\n`;
			md += `**Model:** ${session.modelName}  \n`;
			md += `**Started:** ${new Date(session.started).toLocaleString()}\n\n`;
			for (const msg of session.messages) {
				md += `---\n**${msg.role === 'user' ? 'User' : 'Assistant'}** (${new Date(msg.timestamp).toLocaleString()})\n\n`;
				md += msg.content + '\n\n';
			}
			const blob = new Blob([md], { type: 'text/markdown' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `chat-session-${session.id}.md`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
	}

	function handleResume(session: ChatSession) {
		localStorage.setItem(
			'bigstep-resume-session',
			JSON.stringify({
				messages: session.messages,
				modelId: session.modelId,
				modelName: session.modelName
			})
		);
		goto('/assistant/chat');
	}

	$: filteredSessions = sessions.filter((session) => {
		if (!search) return true;
		const lower = search.toLowerCase();
		const modelMatch = session.modelName.toLowerCase().includes(lower);
		const dateMatch = new Date(session.started).toLocaleString().toLowerCase().includes(lower);
		const messageMatch = session.messages.some((m) => m.content.toLowerCase().includes(lower));
		return modelMatch || dateMatch || messageMatch;
	});
</script>

<div class="flex w-full flex-col gap-4 p-4 sm:p-6">
	<Card class="mx-auto min-h-[400px] w-full max-w-4xl p-4 sm:p-6">
		<h2 class="mb-4 text-lg font-semibold">Chat History</h2>
		<div class="mb-4 flex w-full max-w-md">
			<Input
				type="text"
				placeholder="Search by model, message, or date..."
				bind:value={search}
				class="w-full"
			/>
		</div>
		{#if filteredSessions.length === 0}
			<div class="text-muted-foreground">No chat sessions found.</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[700px] border text-sm">
					<thead>
						<tr class="bg-muted">
							<th class="px-3 py-2 text-left font-semibold">Date</th>
							<th class="px-3 py-2 text-left font-semibold">Model</th>
							<th class="px-3 py-2 text-left font-semibold">Preview</th>
							<th class="w-40 px-3 py-2 text-left font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredSessions as session}
							<tr class="border-b hover:bg-muted">
								<td class="px-3 py-2">{new Date(session.started).toLocaleString()}</td>
								<td class="px-3 py-2">{session.modelName}</td>
								<td class="cursor-pointer px-3 py-2" on:click={() => openSession(session)}
									>{getPreview(session)}</td
								>
								<td class="w-40 px-3 py-2">
									<div class="relative inline-block">
										<button
											class="mr-1 rounded bg-muted px-2 py-1 text-xs"
											on:click|stopPropagation={() => exportSession(session, 'md')}>Export</button
										>
										<button
											class="mr-1 rounded bg-muted px-2 py-1 text-xs"
											on:click|stopPropagation={() => handleResume(session)}
											on:mousedown|stopPropagation>Resume</button
										>
										<button
											class="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
											on:click|stopPropagation={() => handleDelete(session.id)}>Delete</button
										>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Card>

	{#if selectedSession}
		<Card class="mx-auto mt-6 w-full max-w-2xl p-4 sm:p-6">
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-lg font-semibold">Chat Transcript</h3>
				<button class="rounded bg-muted px-4 py-2 text-sm" on:click={closeModal}>Close</button>
			</div>
			<div class="mb-2 text-sm text-muted-foreground">
				Model: <span class="font-semibold">{selectedSession.modelName}</span> &mdash; {new Date(
					selectedSession.started
				).toLocaleString()}
			</div>
			<div class="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
				{#each selectedSession.messages as msg}
					<div class="flex flex-col gap-1">
						<div class="text-xs text-muted-foreground">
							{msg.role === 'user' ? 'User' : 'Assistant'}
							&bull;
							{new Date(msg.timestamp).toLocaleString()}
						</div>
						<div class="whitespace-pre-line rounded bg-muted p-2 text-sm">{msg.content}</div>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
</div>

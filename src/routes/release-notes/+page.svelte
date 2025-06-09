<script lang="ts">
	import { marked } from 'marked';
	// @ts-ignore
	import markdown from './rn-content.md?raw';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';

	const html: string = marked.parse(markdown) as string;
</script>

<div class="flex flex-col gap-4 p-6">
	<Card class="p-6 text-left">
		<div class="prose prose-sm max-w-none text-left">{@html html}</div>
	</Card>
</div>

<style>
	.prose :global(*) {
		all: revert;
	}
</style>

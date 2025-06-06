<script lang="ts">
	import { Card } from '$lib/components/ui/card/index.js';
	import { marked } from 'marked';

	// @ts-ignore
	import markdown from '$lib/docs/overview.md?raw';

	const html: string = marked.parse(markdown);
</script>

<div class="flex flex-col gap-4 p-6">
	<Card class="p-6 text-left">
		<div class="prose max-w-none text-left">{@html html}</div>
	</Card>
</div>

<style>
	.prose :global(*) {
		all: revert;
	}
</style>

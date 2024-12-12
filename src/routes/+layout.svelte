<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ModeWatcher } from "mode-watcher";
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	let { children } = $props();
</script>

<!-- <ModeWatcher /> -->
<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>

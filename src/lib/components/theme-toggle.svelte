<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Moon, Sun, Monitor } from 'lucide-svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	let currentTheme: 'dark' | 'light' | 'system';
	$: currentTheme = $theme;

	function setTheme(newTheme: 'dark' | 'light' | 'system') {
		theme.set(newTheme);
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger asChild>
		<Button variant="ghost" size="icon" class="h-9 w-9">
			{#if currentTheme === 'dark'}
				<Moon class="h-4 w-4" />
			{:else if currentTheme === 'light'}
				<Sun class="h-4 w-4" />
			{:else}
				<Monitor class="h-4 w-4" />
			{/if}
			<span class="sr-only">Toggle theme</span>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end">
		<DropdownMenuItem on:click={() => setTheme('light')}>
			<Sun class="mr-2 h-4 w-4" />
			<span>Light</span>
		</DropdownMenuItem>
		<DropdownMenuItem on:click={() => setTheme('dark')}>
			<Moon class="mr-2 h-4 w-4" />
			<span>Dark</span>
		</DropdownMenuItem>
		<DropdownMenuItem on:click={() => setTheme('system')}>
			<Monitor class="mr-2 h-4 w-4" />
			<span>System</span>
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>

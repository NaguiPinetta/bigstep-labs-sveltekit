<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import LoginForm from '$lib/components/login-form.svelte';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';

	onMount(() => {
		const path = $page.url.pathname;
		console.log('[layout] onMount: $user =', $user, 'path =', path);
		if (!$user && path !== '/login') {
			goto('/login');
		}
		if ($user && path === '/login') {
			goto('/assistant/chat');
		}
	});
</script>

<svelte:head>
	<title>BigStep Labs</title>
	<meta name="description" content="BigStep Labs - AI Development Platform" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<header
		class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container flex h-14 items-center">
			<div class="mr-4 flex">
				<a class="mr-6 flex items-center space-x-2" href="/">
					<span class="font-bold">BigStep Labs</span>
				</a>
			</div>
			<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
				<nav class="flex items-center space-x-2">
					<ThemeToggle />
				</nav>
			</div>
		</div>
	</header>

	<main class="container py-6">
		<slot />
	</main>
</div>

{#if $page.route.id === '/login'}
	<div class="flex h-screen w-full items-center justify-center px-4">
		<LoginForm />
	</div>
{:else}
	<Sidebar.Provider>
		<AppSidebar />
		<Sidebar.Inset>
			<header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<Breadcrumb.Root>
						<Breadcrumb.List>
							<Breadcrumb.Item class="hidden md:block">
								<Breadcrumb.Link href="#">BigStep</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator class="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Page>
									<!-- Render current page from SvelteKit's $page store, fallback to "Assistant" -->
									{#if $page.route.id}
										{#if $page.route.id === '/assistant'}
											Assistant
										{:else if $page.route.id === '/'}
											Dashboard
										{:else}
											{$page.route.id.replace('/', '').charAt(0).toUpperCase() +
												$page.route.id.slice(2)}
										{/if}
									{:else}
										Assistant
									{/if}
								</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>
			</header>
			<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
				<slot />
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}

<style>
	:global(:root) {
		--background: 0 0% 100%;
		--foreground: 240 10% 3.9%;
		--card: 0 0% 100%;
		--card-foreground: 240 10% 3.9%;
		--popover: 0 0% 100%;
		--popover-foreground: 240 10% 3.9%;
		--primary: 240 5.9% 10%;
		--primary-foreground: 0 0% 98%;
		--secondary: 240 4.8% 95.9%;
		--secondary-foreground: 240 5.9% 10%;
		--muted: 240 4.8% 95.9%;
		--muted-foreground: 240 3.8% 46.1%;
		--accent: 240 4.8% 95.9%;
		--accent-foreground: 240 5.9% 10%;
		--destructive: 0 84.2% 60.2%;
		--destructive-foreground: 0 0% 98%;
		--border: 240 5.9% 90%;
		--input: 240 5.9% 90%;
		--ring: 240 5.9% 10%;
		--radius: 0.5rem;
	}

	:global(.dark) {
		--background: 240 10% 3.9%;
		--foreground: 0 0% 98%;
		--card: 240 10% 3.9%;
		--card-foreground: 0 0% 98%;
		--popover: 240 10% 3.9%;
		--popover-foreground: 0 0% 98%;
		--primary: 0 0% 98%;
		--primary-foreground: 240 5.9% 10%;
		--secondary: 240 3.7% 15.9%;
		--secondary-foreground: 0 0% 98%;
		--muted: 240 3.7% 15.9%;
		--muted-foreground: 240 5% 64.9%;
		--accent: 240 3.7% 15.9%;
		--accent-foreground: 0 0% 98%;
		--destructive: 0 62.8% 30.6%;
		--destructive-foreground: 0 0% 98%;
		--border: 240 3.7% 15.9%;
		--input: 240 3.7% 15.9%;
		--ring: 240 4.9% 83.9%;
	}
</style>

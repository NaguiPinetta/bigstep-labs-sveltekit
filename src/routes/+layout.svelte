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

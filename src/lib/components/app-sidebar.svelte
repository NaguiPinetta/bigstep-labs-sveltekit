<script lang="ts" module>
	import AudioWaveform from 'lucide-svelte/icons/audio-waveform';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Bot from 'lucide-svelte/icons/bot';
	import ChartPie from 'lucide-svelte/icons/chart-pie';
	import Command from 'lucide-svelte/icons/command';
	import Frame from 'lucide-svelte/icons/frame';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import Map from 'lucide-svelte/icons/map';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';
	import LogOut from 'lucide-svelte/icons/log-out';

	// This is sample data.
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		teams: [
			{
				name: 'BigStep',
				logo: GalleryVerticalEnd,
				plan: 'Enterprise'
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveform,
				plan: 'Startup'
			},
			{
				name: 'Evil Corp.',
				logo: Command,
				plan: 'Free'
			}
		],
		navMain: [
			{
				title: 'Assistant',
				url: '/assistant',
				icon: Bot,
				isActive: false,
				items: []
			},
			{
				title: 'History',
				url: '/assistant/history',
				icon: Frame
			},
			{
				title: 'Documentation',
				url: '/documentation',
				icon: BookOpen
			},
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings2
			},
			{
				title: 'Agents',
				url: '/agents',
				icon: Command
			},
			{
				title: 'Model Profiles',
				url: '/models',
				icon: SquareTerminal
			},
			{
				title: 'Datasets',
				url: '/datasets',
				icon: ChartPie
			},
			{
				title: 'Personas',
				url: '/personas',
				icon: Map
			},
			{
				title: 'Workbench',
				url: '/workbench',
				icon: AudioWaveform
			}
		],
		projects: [
			{
				name: 'Design Engineering',
				url: '#',
				icon: Frame
			},
			{
				name: 'Sales & Marketing',
				url: '#',
				icon: ChartPie
			},
			{
				name: 'Travel',
				url: '#',
				icon: Map
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavProjects from '$lib/components/nav-projects.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import TeamSwitcher from '$lib/components/team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { user as userStore } from '$lib/stores/user';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	async function logout() {
		console.log('[sidebar logout] Logout button clicked');
		const before = await supabase.auth.getSession();
		console.log('[sidebar logout] Session before signOut:', before);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error('[sidebar logout] Supabase signOut error:', error);
			} else {
				console.log('[sidebar logout] Supabase signOut success');
			}
		} catch (e) {
			console.error('[sidebar logout] Exception during signOut:', e);
		}
		const after = await supabase.auth.getSession();
		console.log('[sidebar logout] Session after signOut:', after);
		userStore.set(null);
		console.log('[sidebar logout] userStore.set(null) called');
		goto('/login');
		console.log('[sidebar logout] Redirected to /login');
	}
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} {logout} />
		<!-- <NavProjects projects={data.projects} /> -->
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if $userStore}
			<NavUser
				user={{ name: $userStore.name, email: $userStore.email, avatar: $userStore.avatar_url }}
			/>
		{/if}
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>

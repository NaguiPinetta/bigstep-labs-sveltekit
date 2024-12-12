<script lang="ts">
    import { page } from "$app/stores";
	import LoginForm from "$lib/components/login-form.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
</script>


{#if $page.route.id?.includes('auth')}
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
                                <Breadcrumb.Page>Assistant</Breadcrumb.Page>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </div>
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div class="bg-muted/50 aspect-video rounded-xl"></div>
                    <div class="bg-muted/50 aspect-video rounded-xl"></div>
                    <div class="bg-muted/50 aspect-video rounded-xl"></div>
                </div>
                <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
{/if}

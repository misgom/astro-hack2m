<script>
    import { currentUser } from '../stores/user';
    import { onMount } from 'svelte';
    import { getCurrentUser } from '../stores/user';

    let loading = true;

    onMount(async () => {
        await getCurrentUser();
        loading = false;
    });
</script>

<div class="flex items-center gap-2">
    {#if loading}
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            <div class="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
    {:else if !$currentUser.name.startsWith('anon-')}
        <div class="flex items-center gap-2 text-white">
            <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span class="text-sm font-medium">
                    {$currentUser.name ? $currentUser.name[0].toUpperCase() : 'A'}
                </span>
            </div>
            <span class="font-medium">
                {#if !$currentUser.is_anonymous}
                    {$currentUser.name || 'Usuario'}
                {/if}
            </span>
        </div>
    {/if}
</div>

<style>
</style>

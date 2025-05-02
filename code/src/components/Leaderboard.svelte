<script>
    import { config } from '../config';
    import { Spinner } from 'flowbite-svelte';
    import { onMount } from 'svelte';

    let leaderboard = [];
    let loading = true;
    let error = null;

    async function fetchLeaderboard() {
        try {
            loading = true;
            const response = await fetch(
                `${config.api.baseUrl}${config.api.endpoints.leaderboard}`,
                { credentials: 'include' }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            const data = await response.json();
            if (data.success && data.data && data.data.leaderboard) {
                // Convert the leaderboard object to an array and sort by score
                leaderboard = data.data.leaderboard
            } else {
                throw new Error('Invalid response format');
            }
        } catch (e) {
            error = e.message;
            console.error('Error fetching leaderboard:', e);
        } finally {
            loading = false;
        }
    }

    onMount(fetchLeaderboard);
</script>

<div class="bg-white/10 rounded-lg p-6">
    <h2 class="text-2xl font-bold text-white mb-6">Leaderboard</h2>

    {#if loading}
        <div class="flex justify-center items-center py-8">
            <Spinner />
        </div>
    {:else if error}
        <div class="text-red-500 text-center py-4">
            {error}
            <button
                class="mt-4 px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 text-white rounded-md transition-colors"
                on:click={fetchLeaderboard}
            >
                Retry
            </button>
        </div>
    {:else if leaderboard.length === 0}
        <div class="text-white/80 text-center py-4">
            No scores available yet
        </div>
    {:else}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left border-b border-white/20">
                        <th class="pb-3 text-white/80">Rank</th>
                        <th class="pb-3 text-white/80">Name</th>
                        <th class="pb-3 text-white/80">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {#each leaderboard as { name, score }, i}
                        <tr class="border-b border-white/10 last:border-0">
                            <td class="py-3 text-white/80">#{i + 1}</td>
                            <td class="py-3 text-white">{name}</td>
                            <td class="py-3 text-white">{score}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

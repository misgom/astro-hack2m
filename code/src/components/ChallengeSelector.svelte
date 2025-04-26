<script>
    import { Button, Card, Spinner } from "flowbite-svelte";
    import { selectedChallenge, completedChallenges } from '../stores/challenge';
    import { config } from '../config';

    let challenges = [];
    let loading = true;
    let error = null;

    async function fetchChallenges() {
        try {
            loading = true;
            // Reset selected challenge while loading
            $selectedChallenge = null;

            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.challenges}`);
            if (!response.ok) {
                throw new Error('Failed to fetch challenges');
            }
            const data = await response.json();
            if (data.success && data.data && Array.isArray(data.data.challenges)) {
                challenges = data.data.challenges;
                if (challenges.length > 0) {
                    $selectedChallenge = challenges[0];
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (e) {
            error = e.message;
            console.error('Error fetching challenges:', e);
        } finally {
            loading = false;
        }
    }

    // Fetch challenges when component mounts
    fetchChallenges();
</script>

<Card class="h-full">
    <h5 class="text-2xl font-bold tracking-tight text-white mb-4">
        Challenges
    </h5>

    {#if loading}
        <div class="space-y-2">
            {#each Array(9) as _}
                <div class="w-full h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            {/each}
        </div>
    {:else if error}
        <div class="text-red-500 text-center py-4">
            {error}
            <Button color="blue" class="mt-4" on:click={fetchChallenges}>
                Retry
            </Button>
        </div>
    {:else if challenges.length === 0}
        <div class="text-white/80 text-center py-4">
            No challenges available
        </div>
    {:else}
        <div class="space-y-2">
            {#each challenges as challenge}
                <Button
                    color={$selectedChallenge?.id === challenge.id ? "blue" : "dark"}
                    class="w-full text-left justify-start relative
                        {$completedChallenges.includes(challenge.id) ? 'border-l-[6px] border-green-500' : ''}
                        {$selectedChallenge?.id === challenge.id ? 'bg-blue-500/10 hover:bg-blue-500/15' : ''}"
                    on:click={() => $selectedChallenge = challenge}
                >
                    <div class="flex items-center justify-between w-full">
                        <span class="{$completedChallenges.includes(challenge.id) && $selectedChallenge?.id !== challenge.id ? 'text-green-400' : 'text-white'}">
                            {challenge.title}
                        </span>
                        {#if $completedChallenges.includes(challenge.id)}
                            <span class="text-green-500 text-xl font-bold">✓</span>
                        {/if}
                    </div>
                </Button>
            {/each}
        </div>
    {/if}
</Card>

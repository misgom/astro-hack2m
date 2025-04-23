<script>
    import { Button, Card, Spinner } from "flowbite-svelte";
    import { selectedChallenge } from '../stores/challenge';
    import { config } from '../config';

    let challenges = [];
    let loading = true;
    let error = null;

    async function fetchChallenges() {
        try {
            loading = true;
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
        <div class="flex justify-center items-center py-8">
            <Spinner />
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
                    class="w-full text-left flex justify-between items-center"
                    on:click={() => $selectedChallenge = challenge}
                >
                    <span class="flex-1 text-left">{challenge.title}</span>
                    <span class="text-xs px-2 py-1 rounded-full ml-2
                        {challenge.difficulty === 'EASY' ? 'bg-green-500' :
                         challenge.difficulty === 'MEDIUM' ? 'bg-yellow-500' :
                         'bg-red-500'}">
                        {challenge.difficulty}
                    </span>
                </Button>
            {/each}
        </div>
    {/if}
</Card>

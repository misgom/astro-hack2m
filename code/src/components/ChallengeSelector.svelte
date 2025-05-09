<script>
    import { Button, Card } from "flowbite-svelte";
    import { selectedChallenge, completedChallenges } from '../stores/challenge';
    import { config } from '../config';
    import { onMount } from 'svelte';
    import { apiFetch } from "../lib/apiFetch";

    let challenges = [];
    let loading = true;
    let error = null;
    let challengeScores = {};

    async function fetchChallenges() {
        try {
            loading = true;
            // Reset selected challenge while loading
            $selectedChallenge = null;

            const [challengesResponse, scoresResponse] = await Promise.all([
                apiFetch(`${config.api.endpoints.challenges}`,
                    {credentials: 'include'}
                ),
                apiFetch(`${config.api.endpoints.scores}`,
                    {credentials: 'include'}
                )
            ]);

            if (!challengesResponse.ok) {
                throw new Error('Failed to fetch challenges');
            }
            if (!scoresResponse.ok) {
                throw new Error('Failed to fetch scores');
            }

            const challengesData = await challengesResponse.json();
            const scoresData = await scoresResponse.json();

            if (challengesData.success && challengesData.data && Array.isArray(challengesData.data.challenges)) {
                challenges = challengesData.data.challenges;
                if (challenges.length > 0) {
                    $selectedChallenge = challenges[0];
                }
            } else {
                throw new Error('Invalid challenges response format');
            }

            if (scoresData.success && scoresData.data && Array.isArray(scoresData.data.score)) {
                challengeScores = scoresData.data.score.reduce((scores, { key, ...attr }) => {
                    scores[key] = attr;
                    return scores;
                }, {});
                // update completed challenges store
                completedChallenges.set(Object.entries(challengeScores)
                    .filter(([_, value]) => value.is_final === true)
                    .map(([key]) => key)
                );
            } else {
                throw new Error('Invalid scores response format');
            }
        } catch (e) {
            error = e.message;
            console.error('Error fetching data:', e);
        } finally {
            loading = false;
        }
    }

    // Fetch challenges only once during client-side initialization
    onMount(fetchChallenges);
</script>

<Card class="h-full">
    <h5 class="text-2xl font-bold tracking-tight text-white mb-4">
        Retos
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
                Reintentar
            </Button>
        </div>
    {:else if challenges.length === 0}
        <div class="text-white/80 text-center py-4">
            No hay retos disponibles
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
                    <div class="flex flex-col w-full">
                        <div class="flex items-center justify-between w-full">
                            <span class="{$completedChallenges.includes(challenge.id) && $selectedChallenge?.id !== challenge.id ? 'text-green-400' : 'text-white'}">
                                {challenge.title}
                            </span>
                            {#if $completedChallenges.includes(challenge.id)}
                                <span class="text-green-500 text-xl font-bold">✓</span>
                            {/if}
                        </div>
                        {#if challengeScores[challenge.id] !== undefined}
                            <div class="text-sm text-green-400 mt-1">
                                Puntuación: {challengeScores[challenge.id].score}
                            </div>
                        {/if}
                    </div>
                </Button>
            {/each}
        </div>
    {/if}
</Card>

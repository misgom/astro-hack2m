<script>
    import { Button, Input, Spinner } from "flowbite-svelte";
    import { selectedChallenge } from '../stores/challenge';
    import { config } from '../config';

    let flag = '';
    let verifying = false;
    let result = null;
    let error = null;

    async function verifyFlag() {
        if (!flag.trim()) return;

        verifying = true;
        error = null;
        result = null;

        try {
            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.verify}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    challenge_id: $selectedChallenge.id,
                    flag: flag.trim(),
                    user_id: "1"
                }),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Verification failed');
            }

            result = data;
        } catch (e) {
            error = e.message;
        } finally {
            verifying = false;
        }
    }
</script>

<div class="mt-8 border-t border-white/10 pt-8">
    <h3 class="text-xl font-bold text-white mb-4">Verify Flag</h3>

    <form on:submit|preventDefault={verifyFlag} class="space-y-4">
        <div>
            <Input
                bind:value={flag}
                placeholder="Enter the flag"
                class="w-full"
            />
        </div>

        <Button
            type="submit"
            color="blue"
            class="w-full"
            disabled={verifying || !flag.trim()}
        >
            {#if verifying}
                <Spinner class="mr-2" />
                Verifying...
            {:else}
                Verify Flag
            {/if}
        </Button>
    </form>

    {#if error}
        <div class="mt-4 p-4 bg-red-500/20 rounded-lg">
            <p class="text-red-500">{error}</p>
        </div>
    {/if}

    {#if result}
        <div class="mt-4 p-4 {result.success ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg">
            <p class="{result.success ? 'text-green-500' : 'text-red-500'} font-medium">
                {result.success ? '✅ Flag verified successfully!' : '❌ Invalid flag'}
            </p>
            {#if result.message}
                <p class="text-white/80 mt-2">{result.message}</p>
            {/if}
        </div>
    {/if}
</div>
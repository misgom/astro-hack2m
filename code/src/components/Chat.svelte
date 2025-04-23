<script>
    import { Label, Input, Spinner } from "flowbite-svelte";
    import { selectedChallenge } from '../stores/challenge';
    import FlagVerifier from './FlagVerifier.svelte';
    import { config } from '../config';

    let answer = '';
    let loading = false;
    let error = null;

    const handleSubmit = async (event) => {
        if (!$selectedChallenge) {
            error = 'Please select a challenge first';
            return;
        }

        answer = '';
        error = null;
        event.preventDefault();
        loading = true;
        const question = event.target.question.value;

        try {
            const res = await fetch(`${config.api.baseUrl}${config.api.endpoints.ask}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: question,
                    challenge_id: $selectedChallenge.id,
                    user_id: "1"
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to get response');
            }

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to get response');
            }

            answer = data.data.response;
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="space-y-8">
    <form class="mt-8" on:submit={handleSubmit}>
        <div class="mb-6">
            <Label for="question" class="block mb-2">Your Question</Label>
            <Input id="question" required placeholder="Try to get the flag!"></Input>
        </div>
    </form>

    {#if loading}
        <div class="flex justify-center items-center flex-col gap-y-2">
            <Spinner />
            <p class="font-medium text-white">Generating response...</p>
        </div>
    {/if}

    {#if error}
        <div class="mt-4 p-4 bg-red-500/20 rounded-lg">
            <p class="text-red-500">{error}</p>
        </div>
    {/if}

    {#if answer}
        <div class="mt-8">
            <p class="font-medium text-white">Response:</p>
            <p class="font-medium text-white">{answer}</p>
        </div>
    {/if}

    <FlagVerifier />
</div>

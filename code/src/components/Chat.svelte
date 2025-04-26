<script>
    import { Label, Input, Spinner } from "flowbite-svelte";
    import { selectedChallenge } from '../stores/challenge';
    import FlagVerifier from './FlagVerifier.svelte';
    import { config } from '../config';
    import { marked } from 'marked';

    let loading = false;
    let error = null;
    let question = '';
    let currentAnswer = ''; // Local state for current response
    let challengeHistory = new Map(); // Map to store challenge history

    // Initialize or update challenge history when selected challenge changes
    $: if ($selectedChallenge) {
        if (!challengeHistory.has($selectedChallenge.id)) {
            challengeHistory.set($selectedChallenge.id, {
                question: '',
                answer: '',
                error: null
            });
        }
        // Update current state from history
        const history = challengeHistory.get($selectedChallenge.id);
        question = history.question;
        error = history.error;
        currentAnswer = history.answer;
    }

    const handleSubmit = async (event) => {
        if (!$selectedChallenge) {
            error = 'Please select a challenge first';
            return;
        }

        error = null;
        event.preventDefault();
        loading = true;
        currentAnswer = ''; // Clear current answer while loading

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

            // Update both history and current answer
            const newAnswer = data.data.response;
            currentAnswer = newAnswer;
            challengeHistory.set($selectedChallenge.id, {
                question,
                answer: newAnswer,
                error: null
            });
        } catch (e) {
            error = e.message;
            // Update history with error
            challengeHistory.set($selectedChallenge.id, {
                question,
                answer: '',
                error: e.message
            });
        } finally {
            loading = false;
        }
    }

    // Configure marked options
    marked.setOptions({
        breaks: true, // Convert \n to <br>
        gfm: true,    // Enable GitHub Flavored Markdown
    });
</script>

<div class="space-y-8">
    <form class="mt-8" on:submit={handleSubmit}>
        <div class="mb-6">
            <Label for="question" class="block mb-2">Your Question</Label>
            <Input bind:value={question} id="question" required placeholder="Try to get the flag!"></Input>
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

    {#if currentAnswer}
        <div class="mt-8">
            <p class="font-medium text-white mb-2">Response:</p>
            <div class="prose prose-invert max-w-none">
                {@html marked(currentAnswer)}
            </div>
        </div>
    {/if}

    <FlagVerifier />
</div>

<style>
    :global(.prose) {
        color: white;
    }

    :global(.prose pre) {
        background-color: #1a1a1a;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
    }

    :global(.prose code) {
        background-color: #1a1a1a;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
    }

    :global(.prose a) {
        color: #63e;
        text-decoration: underline;
    }

    :global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
        color: white;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }

    :global(.prose p) {
        margin-bottom: 1rem;
    }

    :global(.prose ul, .prose ol) {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
    }

    :global(.prose blockquote) {
        border-left: 4px solid #63e;
        padding-left: 1rem;
        margin-left: 0;
        color: #a0a0a0;
    }
</style>

<script>
    import { Label, Input, Spinner, Select } from "flowbite-svelte";
    import { selectedChallenge } from '../stores/challenge';
    import FlagVerifier from './FlagVerifier.svelte';
    import { config } from '../config';
    import { marked } from 'marked';
    import { markedHighlight } from 'marked-highlight';
    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';

    let loading = false;
    let error = null;
    let question = '';
    let currentAnswer = '';
    let challengeHistory = new Map();
    let selectedDifficulty = 'EASY';

    const difficulties = [
        { value: 'EASY', label: 'Easy' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HARD', label: 'Hard' }
    ];

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
        // Update selected difficulty to match the current challenge
        selectedDifficulty = $selectedChallenge.difficulty;
    }

    // Configure marked with syntax highlighting
    marked.use(markedHighlight({
        highlight(code, lang) {
            if (!lang) return code;
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (e) {
                return code;
            }
        }
    }));

    // Configure marked options
    marked.setOptions({
        breaks: true, // Convert \n to <br>
        gfm: true,    // Enable GitHub Flavored Markdown
    });

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
</script>

<div class="space-y-8">
    {#if !$selectedChallenge}
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
                <div class="w-48 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
                <div class="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div class="w-48 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
    {:else}
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
                <h2 class="text-2xl font-bold text-white">{$selectedChallenge.title}</h2>
                <span class="text-sm px-2 py-1 rounded-full
                    {$selectedChallenge.difficulty === 'EASY' ? 'bg-green-500' :
                     $selectedChallenge.difficulty === 'MEDIUM' ? 'bg-yellow-500' :
                     'bg-red-500'}">
                    {$selectedChallenge.difficulty}
                </span>
            </div>
            <div class="w-48">
                <select
                    bind:value={selectedDifficulty}
                    class="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                    {#each difficulties as difficulty}
                        <option value={difficulty.value}>{difficulty.label}</option>
                    {/each}
                </select>
            </div>
        </div>
    {/if}

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
    /* No styles needed here as they are now global */
</style>

<script>
    import { Label, Input, Spinner, Select } from "flowbite-svelte";
    import { selectedChallenge } from '../stores/challenge';
    import FlagVerifier from './FlagVerifier.svelte';
    import { config } from '../config';
    import { marked } from 'marked';
    import { markedHighlight } from 'marked-highlight';
    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';
    import { PaperAirplaneIcon } from '@heroicons/vue/24/solid';
    import { onMount } from 'svelte';

    let loading = false;
    let error = null;
    let question = '';
    let currentAnswer = '';
    let challengeHistory = new Map();
    let selectedDifficulty = 'EASY';
    let selectedFile = null;

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

    const handleFileChange = (event) => {
        selectedFile = event.target.files[0];
    };

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
            const formData = new FormData();
            formData.append('prompt', question);
            formData.append('challenge_id', $selectedChallenge.id);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await fetch(`${config.api.baseUrl}${config.api.endpoints.ask}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
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
    async function getFlag() {
        try {
            const res = await fetch(`${config.api.baseUrl}/xss`, {credentials: 'include'});
            if (!res.ok) throw new Error('Failed to get flag');
            const flag = await res.text();
            alert(flag);
        } catch (e) {
            console.error(e);
        }
    }
    onMount(() => {
        // Esto se corre SOLO en el navegador
        window.getFlag = getFlag;
    });
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
            <div class="relative">
                <Input bind:value={question} id="question" required placeholder="Try to get the flag!" class="pr-12"></Input>
                <button type="submit" class="absolute right-2.5 bottom-2.5 p-2 text-white bg-blue-600/60 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 rounded-lg transition-colors">
                    <PaperAirplaneIcon class="w-6 h-6" />
                </button>
            </div>
        </div>
        {#if $selectedChallenge?.id === "indirect-prompt-injection"}
            <div class="mb-6">
                <Label for="file" class="block mb-2">Upload File (.txt only)</Label>
                <input type="file" id="file" accept=".txt" on:change={handleFileChange} class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
            </div>
        {/if}
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
</style>

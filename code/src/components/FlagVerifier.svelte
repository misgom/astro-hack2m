<script>
    import { Button, Input, Spinner, Tooltip } from "flowbite-svelte";
    import { selectedChallenge, completedChallenges } from '../stores/challenge';
    import { config } from '../config';
    import Icon from '@iconify/svelte';
    import { apiFetch } from "../lib/apiFetch";

    let flag = '';
    let verifying = false;
    let result = null;

    // Clear verification state when selected challenge changes
    $: if ($selectedChallenge) {
        flag = '';
        result = null;
    }

    async function verifyFlag() {
        if (!flag.trim()) return;

        verifying = true;
        result = null;

        try {
            const response = await apiFetch(`${config.api.endpoints.verify}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    challenge_id: $selectedChallenge.id,
                    flag: flag.trim()
                }),
            });

            const data = await response.json();
            result = data;

            if (data.success && !$completedChallenges.includes($selectedChallenge.id)) {
                $completedChallenges = [...$completedChallenges, $selectedChallenge.id];
            }
        } catch (e) {
            result = {
                success: false,
                message: 'Failed to verify flag. Please try again.'
            };
        } finally {
            verifying = false;
        }
    }
</script>

<div class="mt-8 border-t border-white/10 pt-8">
    <div id="verify-flag" class="flex items-center gap-2 mb-4">
        <h3 class="text-xl font-bold text-white">Verificar Flag</h3>
        <Icon id="question-icon" icon="heroicons:question-mark-circle" class="w-5 h-5" />
        <Tooltip type="auto" triggeredBy="#verify-flag">
            Una flag es una cadena especial que demuestra que has resuelto el reto.
            Tiene el siguiente formato: flag&#123;some_random_hash_123&#125;.
            ¡Búscala en la respuesta del reto o intenta explotar el sistema para encontrarla!
        </Tooltip>
    </div>

    <form on:submit|preventDefault={verifyFlag} class="space-y-4">
        <div>
            <Input
                bind:value={flag}
                placeholder="Introduce la flag"
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
                Verificando...
            {:else}
                Verificar flag
            {/if}
        </Button>
    </form>

    {#if result}
        <div class="mt-4 p-4 {result.success ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg">
            <p class="{result.success ? 'text-green-500' : 'text-red-500'} font-medium">
                {result.success ? '✅ Flag verificada correctamente!' : '❌ Flag inválida'}
            </p>
            {#if result.message}
                <p class="text-white/80 mt-2">{result.message}</p>
            {/if}
        </div>
    {/if}
</div>

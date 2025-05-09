<script>
    import { Button, Input, Label, Modal } from "flowbite-svelte";
    import Icon from '@iconify/svelte';
    import { config } from '../config';
    import { accountLinkerModal, closeAccountLinkerModal } from '../stores/modal';
    import { getCurrentUser } from '../stores/user';
    import { apiFetch } from "../lib/apiFetch";

    let username = '';
    let password = '';
    let showPassword = false;

    async function handleSubmit() {
        if (!password || !username) {
            accountLinkerModal.update(state => ({ ...state, error: 'Please fill in all fields' }));
            return;
        }

        accountLinkerModal.update(state => ({ ...state, loading: true, error: null }));

        try {
            const response = await apiFetch(`${config.api.endpoints.link}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'include',
                    body: new URLSearchParams({
                        username,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to link account');
            }

            accountLinkerModal.update(state => ({ ...state, success: true }));
            sessionStorage.setItem('auth_token', data?.data?.access_token);
            // Refresh user data after successful linking
            await getCurrentUser();
            // Close modal after 2 seconds
            setTimeout(closeAccountLinkerModal, 2000);
        } catch (e) {
            console.log(e)
            accountLinkerModal.update(state => ({ ...state, error: e.message }));
        } finally {
            accountLinkerModal.update(state => ({ ...state, loading: false }));
        }
    }
</script>

<Modal bind:open={$accountLinkerModal.isOpen} on:close={closeAccountLinkerModal}>
    <div class="p-6">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Vincula tu cuenta para guardar tu progreso
        </h3>

        {#if $accountLinkerModal.success}
            <div class="text-green-500 text-center py-4">
                ¡Cuenta vinculada correctamente!
            </div>
        {:else}
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <Label for="name" class="mb-2">Nombre de usuario:</Label>
                <Input
                    id="name"
                    type="text"
                    bind:value={username}
                    placeholder="Introduce tu nombre de usuario"
                    required
                />

                <div>
                    <Label for="password" class="mb-2">Contraseña:</Label>
                    <div class="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            bind:value={password}
                            class="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                            on:click={() => (showPassword = !showPassword)}
                        >
                            <Icon icon={showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'} class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {#if $accountLinkerModal.error}
                    <div class="text-red-500 text-sm">
                        {$accountLinkerModal.error}
                    </div>
                {/if}

                <div class="flex justify-end space-x-2 mt-4">
                    <Button color="gray" on:click={closeAccountLinkerModal}>
                        Cancelar
                    </Button>
                    <Button type="submit" color="blue" disabled={$accountLinkerModal.loading}>
                        {$accountLinkerModal.loading ? 'Vinculando...' : 'Crear Cuenta'}
                    </Button>
                </div>
            </form>
        {/if}
    </div>
</Modal>

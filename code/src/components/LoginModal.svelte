<script>
    import { Button, Input, Label, Modal } from "flowbite-svelte";
    import { config } from '../config';
    import { loginModal, closeLoginModal } from '../stores/modal';
    import Icon from '@iconify/svelte';
    import { apiFetch } from "../lib/apiFetch";

    let username = '';
    let password = '';
    let showPassword = false;

    async function handleSubmit() {
        if (!username || !password) {
            loginModal.update(state => ({ ...state, error: 'Please fill in all fields'}));
        }

        loginModal.update(state => ({ ...state, loading: true, error: null}));

        try {
            const response = await apiFetch(`${config.api.endpoints.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            sessionStorage.setItem('auth_token', data.access_token);
            window.location.reload();
        } catch (e) {
            loginModal.update(state => ({ ...state, error: e.message }));
        } finally {
            loginModal.update(state => ({ ...state, loading: false }));
        }
    }
</script>

<Modal bind:open={$loginModal.isOpen} on:close={closeLoginModal}>
    <div class="p-6">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Vincula tu cuenta para guardar tu progreso
        </h3>

        {#if $loginModal.success}
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

                {#if $loginModal.error}
                    <div class="text-red-500 text-sm">
                        {$loginModal.error}
                    </div>
                {/if}

                <div class="flex justify-end space-x-2 mt-4">
                    <Button color="gray" on:click={closeLoginModal}>
                        Cancelar
                    </Button>
                    <Button type="submit" color="blue" disabled={$loginModal.loading}>
                        {$loginModal.loading ? 'Creando...' : 'Crear Cuenta'}
                    </Button>
                </div>
            </form>
        {/if}
    </div>

</Modal>

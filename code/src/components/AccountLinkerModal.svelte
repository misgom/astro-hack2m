<script>
    import { Button, Input, Label, Modal } from "flowbite-svelte";
    import { config } from '../config';
    import { accountLinkerModal, closeAccountLinkerModal } from '../stores/modal';
    import { fetchCurrentUser } from '../stores/user';

    let email = '';
    let username = '';

    async function handleSubmit() {
        if (!email || !username) {
            accountLinkerModal.update(state => ({ ...state, error: 'Please fill in all fields' }));
            return;
        }

        accountLinkerModal.update(state => ({ ...state, loading: true, error: null }));

        try {
            const response = await fetch(
                `${config.api.baseUrl}${config.api.endpoints.link}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: email,
                        name: username
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to link account');
            }

            accountLinkerModal.update(state => ({ ...state, success: true }));
            // Refresh user data after successful linking
            await fetchCurrentUser();
            // Close modal after 2 seconds
            setTimeout(closeAccountLinkerModal, 2000);
        } catch (e) {
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
                <Label for="email" class="mb-2">Correo electrónico:</Label>
                <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder="Introduce tu correo electrónico"
                    required
                />

                <Label for="name" class="mb-2">Nombre de usuario:</Label>
                <Input
                    id="name"
                    label="Nombre de usuario"
                    bind:value={username}
                    placeholder="Introduce tu nombre de usuario"
                    required
                />

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
                        {$accountLinkerModal.loading ? 'Vinculando...' : 'Vincular Cuenta'}
                    </Button>
                </div>
            </form>
        {/if}
    </div>
</Modal>

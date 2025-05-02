<script>
    import { Button, Input, Label, Modal } from "flowbite-svelte";
    import { config } from '../config';

    let isOpen = false;
    let email = '';
    let username = '';
    let loading = false;
    let error = null;
    let success = false;

    function openModal() {
        console.log("Opening link account...")
        isOpen = true;
    }

    function closeModal() {
        console.log("Closing link account...")
        isOpen = false;
        email = '';
        username = '';
        error = null;
        success = false;
    }

    async function handleSubmit() {
        if (!email || !username) {
            error = 'Please fill in all fields';
            return;
        }

        loading = true;
        error = null;

        try {
            const response = await fetch(
                `${config.api.baseUrl}/users/link-account`,
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

            success = true;
            // Close modal after 2 seconds
            setTimeout(closeModal, 2000);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }
</script>

<Button color="blue" on:click={openModal}>
    Link Account
</Button>

<Modal bind:open={isOpen} on:close={closeModal}>
    <div class="p-6">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Link Your Account
        </h3>

        {#if success}
            <div class="text-green-500 text-center py-4">
                Account linked successfully!
            </div>
        {:else}
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <Label for="email" class="mb-2">Email:</Label>
                <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder="Enter your email"
                    required
                />

                <Label for="name" class="mb-2">Username:</Label>
                <Input
                    id="name"
                    label="Username"
                    bind:value={username}
                    placeholder="Enter your username"
                    required
                />

                {#if error}
                    <div class="text-red-500 text-sm">
                        {error}
                    </div>
                {/if}

                <div class="flex justify-end space-x-2 mt-4">
                    <Button color="gray" on:click={closeModal}>
                        Cancel
                    </Button>
                    <Button type="submit" color="blue" disabled={loading}>
                        {loading ? 'Linking...' : 'Link Account'}
                    </Button>
                </div>
            </form>
        {/if}
    </div>
</Modal>

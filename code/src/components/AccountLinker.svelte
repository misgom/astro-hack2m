<script>
    import { Button } from "flowbite-svelte";
    import { currentUser } from '../stores/user';
    import { onMount } from 'svelte';
    import { fetchCurrentUser } from '../stores/user';
    import { openAccountLinkerModal } from '../stores/modal';

    let userLoaded = false;

    onMount(async () => {
        await fetchCurrentUser();
        userLoaded = true;
    });
</script>

{#if userLoaded && !$currentUser?.email}
    <Button color="blue" on:click={openAccountLinkerModal}>
        Vincular Cuenta
    </Button>
{/if}

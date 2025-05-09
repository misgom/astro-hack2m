<script>
    import { Button } from "flowbite-svelte";
    import { currentUser } from '../stores/user';
    import { openAccountLinkerModal } from '../stores/modal';

</script>

{#if $currentUser?.is_anonymous}
    <Button color="blue" on:click={openAccountLinkerModal}>
        Vincular Cuenta
    </Button>
{/if}

<script>
    import { Button } from 'flowbite-svelte';
    import { openLoginModal } from '../stores/modal';
    import { currentUser } from '../stores/user';
    import Icon from '@iconify/svelte';

</script>

{#if !currentUser || $currentUser?.is_anonymous}
    <Button color="blue" on:click={openLoginModal}>
        <Icon icon="heroicons:user" class="w-4 h-4 mr-2" />
        Login
    </Button>
{/if}

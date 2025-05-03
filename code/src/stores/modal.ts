import { writable } from 'svelte/store';

export const accountLinkerModal = writable({
    isOpen: false,
    email: '',
    username: '',
    loading: false,
    error: null as string | null,
    success: false
});

export function openAccountLinkerModal() {
    accountLinkerModal.set({
        isOpen: true,
        email: '',
        username: '',
        loading: false,
        error: null,
        success: false
    });
}

export function closeAccountLinkerModal() {
    accountLinkerModal.set({
        isOpen: false,
        email: '',
        username: '',
        loading: false,
        error: null,
        success: false
    });
}

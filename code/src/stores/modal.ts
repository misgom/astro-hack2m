import { writable } from 'svelte/store';

export const accountLinkerModal = writable({
    isOpen: false,
    email: '',
    username: '',
    loading: false,
    error: null as string | null,
    success: false
});

export const loginModal = writable({
    isOpen: false,
    username: '',
    password: '',
    showPassword: false,
    loading: false,
    error: null as string | null,
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

export function openLoginModal() {
    loginModal.set({
        isOpen: true,
        username: '',
        password: '',
        showPassword: false,
        error: null,
        loading: false
    });
}

export function closeLoginModal() {
    loginModal.set({
        isOpen: false,
        username: '',
        password: '',
        showPassword: false,
        error: null,
        loading: false
    });
}

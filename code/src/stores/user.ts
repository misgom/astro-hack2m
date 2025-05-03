import { writable } from 'svelte/store';
import { config } from '../config';

export interface User {
    email?: string;
    name?: string;
}

export const currentUser = writable<User | null>(null);

export async function fetchCurrentUser() {
    try {
        const response = await fetch(`${config.api.baseUrl}/user`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        if (data.success &&  data.data?.user) {
            currentUser.set(data.data.user);
        } else {
            currentUser.set(null);
        }
    } catch (e) {
        console.error('Error fetching user:', e);
        currentUser.set(null);
    }
}

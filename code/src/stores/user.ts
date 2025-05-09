import { writable } from 'svelte/store';
import { openLoginModal } from './modal';
import { config } from '../config';

export interface User {
    email?: string;
    name?: string;
    is_anonymous?: boolean;
}

export const currentUser = writable<User | null>(null);

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

function getUserFromToken(token: string): User | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            name: payload.sub,
            email: payload.email,
            is_anonymous: payload.is_anonymous
        };
    } catch {
        return null;
    }
}

async function fetchAnonymousUser() : Promise<User | null> {
    try {
        const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.token}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('auth_token', data.access_token);
            return getUserFromToken(data?.access_token);
        } else {
            console.error('Failed to fetch anonymous user:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching anonymous user:', error);
        return null;
    }
}

export async function getCurrentUser() {
    try {
        const token = sessionStorage.getItem('auth_token');

        if (!token) {
            let anon_user = await fetchAnonymousUser();
            if (anon_user) {
                currentUser.set(anon_user);
            }
            return;
        }

        if (isTokenExpired(token)) {
            // Token expired, clear it and prompt login
            sessionStorage.removeItem('auth_token');
            currentUser.set(null);
            openLoginModal();
            return;
        }

        // Token is valid, extract user data from it
        const userData = getUserFromToken(token);
        if (userData) {
            currentUser.set(userData);
        } else {
            // Invalid token format, clear it
            sessionStorage.removeItem('auth_token');
            currentUser.set(null);
        }
    } catch (e) {
        console.error('Error processing user token:', e);
        currentUser.set(null);
    }
}

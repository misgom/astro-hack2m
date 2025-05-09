import { writable } from 'svelte/store';

export const selectedChallenge = writable(null);
export const completedChallenges = writable<string[]>([]);
export const challengeScores = writable<Object>({});

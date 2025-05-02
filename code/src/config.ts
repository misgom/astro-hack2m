export const config = {
    api: {
        baseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1',
        endpoints: {
            challenges: '/challenge-definitions',
            ask: '/ask',
            verify: '/verify',
            leaderboard: '/leaderboard',
            scores: '/score',
            link: 'users/link-account'
        },
    },
} as const;

// Type for the config object
export type Config = typeof config;

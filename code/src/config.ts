export const config = {
    api: {
        baseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api',
        endpoints: {
            challenges: '/challenge-definitions',
            ask: '/ask',
            verify: '/verify',
            leaderboard: '/leaderboard',
            scores: '/score',
            link: '/users/link-account',
            user: '/user',
            login: '/login',
            token: '/token'
        },
    },
} as const;

// Type for the config object
export type Config = typeof config;

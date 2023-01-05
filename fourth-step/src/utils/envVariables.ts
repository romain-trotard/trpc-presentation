import { envsafe, str } from 'envsafe';

export const serverEnv = envsafe({
    DATABASE_URL: str({
        input: process.env.DATABASE_URL,
    }),
    GITHUB_ID: str({ input: process.env.GITHUB_ID }),
    GITHUB_SECRET: str({ input: process.env.GITHUB_SECRET }),
});


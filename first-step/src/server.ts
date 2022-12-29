import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const trpc = initTRPC.create();

const appRouter = trpc.router({
    sayHello: trpc.procedure
        // Validation of input data (like REST query params)
        .input((userName: unknown) => {
            if (typeof userName === 'string') {
                return userName;
            }

            throw new Error(`Should provide a string username got ${userName}`);
        })
        .query((request) => {
            const { input: userName } = request;

            return `Hello ${userName}`;
        })
});

// Type to use in the front
export type AppRouter = typeof appRouter;

// Create simple HTTP server
createHTTPServer({
    router: appRouter,
}).listen(9000);


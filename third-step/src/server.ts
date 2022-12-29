import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import z from 'zod';

const trpc = initTRPC.create();

type Todo = {
    id: number;
    name: string;
}

const todos: Todo[] = [{
    id: 1,
    name: 'First todo'
}]

const appRouter = trpc.router({
    getAllTodos: trpc.procedure
        .query(() => {
            return todos;
        }),
    addTodo: trpc.procedure
        // In second-step, the validation was hard to read and work with
        // Now let's use a schema validation library
        // By default values are required
        .input(z.object({ id: z.number(), name: z.string() }))
        .mutation((request) => {
            const { input: newTodo } = request;

            todos.push(newTodo);

            return todos;
        })
});

// Type to use in the front
export type AppRouter = typeof appRouter;



// Create simple HTTP server
const { port } = createHTTPServer({
    router: appRouter,
}).listen(9000);

console.log(`The server is running on the port ${port}`);


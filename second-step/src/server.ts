import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const trpc = initTRPC.create();

type Todo = {
    id: number;
    name: string;
}

const todos: Todo[] = [{
    id: 1,
    name: 'First todo'
}]

const hasId = (value: object): value is { id: unknown } => {
    return 'id' in value;
}
const hasNumberId = (value: object): value is { id: number } => {
    return hasId(value) && typeof value.id === 'number';
}

const hasName = (value: object): value is { name: unknown } => {
    return 'name' in value;
}
const hasStringName = (value: object): value is { name: string } => {
    return hasName(value) && typeof value.name === 'string';
}

const appRouter = trpc.router({
    getAllTodos: trpc.procedure
        .query(() => {
            return todos;
        }),
    addTodo: trpc.procedure
        .input(input => {
            if (typeof input !== 'object' || input === null) {
                throw new Error('Should provide a todo');
            }

            if (!hasNumberId(input)) {
                throw new Error(`The todo needs a number id got ${hasId(input) ? input.id : undefined}`);
            }

            if (!hasStringName(input)) {
                throw new Error(`The todo needs a string name got ${hasName(input) ? input.name : undefined}`);
            }

            return input;
        })
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


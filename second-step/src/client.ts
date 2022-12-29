import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server";

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:9000'
        })
    ]
});


(async function run() {
    // Try to rename the sayHello method name
    // And try to go to the "endpoint" definition
    const todos = await trpc.getAllTodos.query();

    console.log('\n----\n')

    console.log('Getting all TODOs\n', todos, '\n');

    const newTodos = await trpc.addTodo.mutate({ id: 2, name: 'Second todo' });

    console.log('After adding second TODO\n', newTodos);

    console.log('\n----\n')
})();

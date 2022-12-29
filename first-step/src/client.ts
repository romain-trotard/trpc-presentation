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
    const response = await trpc.sayHello.query('Romain');

    console.log(response);
})();

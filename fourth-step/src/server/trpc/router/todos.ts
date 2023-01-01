import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

type Todo = {
    id: number;
    name: string;
    completed: boolean;
}

let index = 0;

const todos: Todo[] = [];

export const todosRouter = router({
    getAll: publicProcedure.query(() => {
        return todos;
    }),
    addTodo: publicProcedure
        .input(z.string())
        .mutation((request) => {
            const { input: newTodo } = request;

            todos.push({ id: index++, name: newTodo, completed: false });

            return todos;
        }),
    toggleCompleteTodo: publicProcedure
        .input(z.number())
        .mutation((request) => {
            const { input: todoId } = request;

            const matchingTodo = todos.find(({ id }) => id === todoId);

            if (matchingTodo) {
                matchingTodo.completed = !matchingTodo.completed;
            }

            return todos;
        }),
    uploadFile: publicProcedure
        .input(z.object({ content: z.string() }))
        .mutation(request => {
            const { input: upload } = request;

            let base64FileContent = upload.content.split(';base64,').pop();

            if (!base64FileContent) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Should have file content',
                });
            }

            const stringContent = Buffer.from(base64FileContent, 'base64').toString();

            const newTodos = stringContent.split('\n')
                .map(todo => todo.trim())
                .filter(todo => todo !== '');

            if (newTodos.length === 0) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'You need to import some non empty todos',
                });
            }

            newTodos.forEach(todo => {
                todos.push({
                    id: index++,
                    name: todo,
                    completed: false,
                });
            })

            return newTodos;
        }),
});


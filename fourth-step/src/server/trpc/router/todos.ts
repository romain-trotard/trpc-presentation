import { z } from "zod";

import { router, publicProcedure } from "../trpc";

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
});


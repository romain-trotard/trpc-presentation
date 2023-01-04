import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const todosRouter = router({
    getAll: publicProcedure.query(async ({ ctx: { prisma } }) => {
        const todos = await prisma.todo.findMany();

        return todos;
    }),
    addTodo: publicProcedure
        .input(z.string())
        .mutation(async ({ input: newTodo, ctx: { prisma } }) => {

            const todoEntity = await prisma.todo.create({ data: { value: newTodo, completed: false } });

            return todoEntity;
        }),
    clearTodos: publicProcedure
        .mutation(async ({ ctx: { prisma } }) => {
            await prisma.todo.deleteMany();
        }),
    setCompleted: publicProcedure
        .input(z.object({ id: z.string(), completed: z.boolean() }))
        .mutation(async ({ input: { id: todoId, completed }, ctx: { prisma } }) => {
            const updatedTodo = prisma.todo.update({ data: { completed }, where: { id: todoId } });

            return updatedTodo;
        }),
    uploadFile: publicProcedure
        .input(z.object({ content: z.string() }))
        .mutation(async ({ input: upload, ctx: { prisma } }) => {
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

            const todosCreated = await prisma.todo.createMany({ data: newTodos.map(todo => ({ value: todo, completed: false })) });

            return todosCreated;
        }),
});


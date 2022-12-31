import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { trpc } from "../utils/trpc";

const EMPTY_ARRAY: any[] = [];
let tempId = Number.MAX_SAFE_INTEGER;

const Home: NextPage = () => {
    const [inputValue, setInputValue] = useState('');
    const utils = trpc.useContext();
    const todos = trpc.todos.getAll.useQuery();
    const addTodoMutation = trpc.todos.addTodo.useMutation({
        onMutate: async (newTodo) => {
            await utils.todos.getAll.cancel();
            setInputValue('');

            const previousTodos = utils.todos.getAll.getData() ?? EMPTY_ARRAY;

            utils.todos.getAll.setData(undefined, [...previousTodos, { name: newTodo, id: tempId--, completed: false }]);

            return { previousTodos };
        },
        onError: (_err, _newTodo, context) => {
            utils.todos.getAll.setData(undefined, context!.previousTodos);
        },
        onSettled: () => {
            utils.todos.getAll.invalidate();
        }
    });
    const toggleCompleteMutation = trpc.todos.toggleCompleteTodo.useMutation({
        onMutate: async (todoId) => {
            await utils.todos.getAll.cancel();

            const previousTodos = utils.todos.getAll.getData() ?? EMPTY_ARRAY;

            utils.todos.getAll.setData(undefined, previousTodos.map(todo => {
                if (todo.id === todoId) {
                    return { ...todo, completed: !todo.completed };
                }

                return todo;
            }));

            return { previousTodos };
        },
        onError: (_err, _newTodo, context) => {
            utils.todos.getAll.setData(undefined, context!.previousTodos);
        },
        onSettled: () => {
            utils.todos.getAll.invalidate();
        }
    });

    if (todos.isError) {
        return <p>Error loading todos</p>
    }

    if (!todos.data) {
        return <p>Loading...</p>
    }

    const numberOfThingsToDo = todos.data.filter(todo => !todo.completed).length;


    return (
        <>
            <Head>
                <title>TODOs</title>
                <meta name="description" content="TODOs application using tRPC" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center bg-slate-50">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight">
                        TODOs tRPC
                    </h1>
                    <div className="flex flex-col bg-white border w-2/4">
                        <input type="text"
                            placeholder="What do you need to do?"
                            className="outline-none px-6 py-3 border-b border-slate-300"
                            value={inputValue}
                            onKeyDown={(e) => {
                                const trimmedValue = inputValue.trim();

                                if (e.code === 'Enter' && trimmedValue !== '') {
                                    addTodoMutation.mutate(inputValue);
                                }
                            }}
                            onChange={e => setInputValue(e.target.value)} />
                        <ul>
                            {
                                todos.data.map(todo => (
                                    <li key={todo.id} className="border-b border-slate-100 flex flex-row gap-3 items-center px-4 py-2 ">
                                        <input type="checkbox" className="ml-2" checked={todo.completed} onChange={async () => {
                                            await toggleCompleteMutation.mutateAsync(todo.id);

                                            utils.todos.getAll.invalidate();
                                        }} />
                                        <label className={`block ${todo.completed && 'line-through text-gray-400'}`}>
                                            {todo.name}
                                        </label>
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="px-6 py-1">
                            <span className="text-base text-slate-500">
                                {`${numberOfThingsToDo} item(s) left`}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;

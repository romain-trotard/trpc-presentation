import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRef, useState } from "react";
import { useSnackbar } from "../components/notifications/SnackbarProvider";

import { trpc } from "../utils/trpc";

const EMPTY_ARRAY: any[] = [];
let tempId = Number.MAX_SAFE_INTEGER;

function getBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            resolve(reader.result as string);
        };
        reader.onerror = function(error) {
            reject(error);
        };
    });
}

const AuthButtons = () => {
    const { data: session } = useSession();
    const utils = trpc.useContext();
    const { showSnackbar } = useSnackbar();
    const clearTodosMutation = trpc.todos.clearTodos.useMutation({
        onMutate: async () => {
            await utils.todos.getAll.cancel();

            const previousTodos = utils.todos.getAll.getData() ?? EMPTY_ARRAY;

            utils.todos.getAll.setData(undefined, []);

            return { previousTodos };
        },
        onError: (err, _newTodo, context) => {
            utils.todos.getAll.setData(undefined, context!.previousTodos);

            // This should never happened because the button is not displayed in this case but just in case
            if (err.data?.code === 'UNAUTHORIZED') {
                showSnackbar({ status: 'error', message: 'You need to be authenticated to clear the list' });
            }
        },
        onSettled: () => {
            utils.todos.getAll.invalidate();
        }
    });

    if (session) {
        return (
            <>
                <button type="button"
                    className="bg-transparent hover:bg-slate-400 text-slate-600 font-semibold hover:text-white py-2 px-4 border border-slate-400 hover:border-transparent rounded mr-2"
                    onClick={() => signOut()}
                >
                    Sign out {session.user?.name}
                </button>
                <button type="button"
                    className="bg-transparent hover:bg-slate-400 text-slate-600 font-semibold hover:text-white py-2 px-4 border border-slate-400 hover:border-transparent rounded mr-2"
                    onClick={() => clearTodosMutation.mutate()}
                >
                    Clear todos
                </button>
            </>
        );
    }

    return (
        <button type="button"
            className="bg-transparent hover:bg-slate-400 text-slate-600 font-semibold hover:text-white py-2 px-4 border border-slate-400 hover:border-transparent rounded mr-2"
            onClick={() => signIn()}
        >
            Sign-in
        </button>
    );
}

const Home: NextPage = () => {
    const [inputValue, setInputValue] = useState('');
    const utils = trpc.useContext();
    const { showSnackbar } = useSnackbar();
    const todos = trpc.todos.getAll.useQuery();
    const addTodoMutation = trpc.todos.addTodo.useMutation({
        onMutate: async (newTodo) => {
            await utils.todos.getAll.cancel();
            setInputValue('');

            const previousTodos = utils.todos.getAll.getData() ?? EMPTY_ARRAY;

            utils.todos.getAll.setData(undefined, [...previousTodos, { value: newTodo, id: `${tempId--}`, completed: false }]);

            return { previousTodos };
        },
        onError: (_err, _newTodo, context) => {
            utils.todos.getAll.setData(undefined, context!.previousTodos);
        },
        onSettled: () => {
            utils.todos.getAll.invalidate();
        }
    });
    const setCompletedMutation = trpc.todos.setCompleted.useMutation({
        onMutate: async ({ id }) => {
            await utils.todos.getAll.cancel();

            const previousTodos = utils.todos.getAll.getData() ?? EMPTY_ARRAY;

            utils.todos.getAll.setData(undefined, previousTodos.map(todo => {
                if (todo.id === id) {
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
    const uploadFileMutation = trpc.todos.uploadFile.useMutation({
        onSuccess: (data) => {
            showSnackbar({ message: `${data.count} TODOs has been imported`, status: 'success' });
        },
        onError: (error) => {
            // Can use `error.data.code` or `error.data.httpStatus`
            showSnackbar({ message: error.message, status: 'error' });
        },
        onSettled: () => {
            utils.todos.getAll.invalidate();
        }
    });
    const uploadInputRef = useRef<HTMLInputElement>(null);

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
                    <div className="flex justify-between w-full">
                        <h1 className="text-5xl font-extrabold tracking-tight flex-1 text-center">
                            TODOs tRPC
                        </h1>
                        <input type="file" className="hidden" ref={uploadInputRef} onChange={async () => {
                            const uploadInput = uploadInputRef.current;
                            const firstFile = uploadInput?.files?.[0];

                            if (uploadInput && firstFile) {
                                const content = await getBase64(firstFile);

                                uploadFileMutation.mutate({ content });
                                uploadInput.value = '';
                            }
                        }} />
                        <AuthButtons />
                        <button type="button"
                            onClick={() => uploadInputRef.current?.click()}
                            className="bg-transparent hover:bg-slate-400 text-slate-600 font-semibold hover:text-white py-2 px-4 border border-slate-400 hover:border-transparent rounded"
                        >
                            Upload a file
                        </button>
                    </div>
                    <div className="flex flex-col bg-white border w-2/4">
                        <input type="text"
                            placeholder="What do you need to do?"
                            className="outline-none px-6 py-3 border-b border-slate-300"
                            value={inputValue}
                            onKeyDown={(e) => {
                                const trimmedValue = inputValue.trim();

                                if (e.key === 'Enter' && trimmedValue !== '') {
                                    addTodoMutation.mutate(inputValue);
                                }
                            }}
                            onChange={e => setInputValue(e.target.value)} />
                        <ul>
                            {
                                todos.data.map(todo => (
                                    <li key={todo.id} className="border-b border-slate-100 flex flex-row gap-3 items-center px-4 py-2 ">
                                        <input type="checkbox" className="ml-2" checked={todo.completed} onChange={async () => {
                                            await setCompletedMutation.mutateAsync({ id: todo.id, completed: !todo.completed });

                                            utils.todos.getAll.invalidate();
                                        }} />
                                        <label className={`block ${todo.completed && 'line-through text-gray-400'}`}>
                                            {todo.value}
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

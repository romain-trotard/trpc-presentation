import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const SnackbarContext = React.createContext<{
    showSnackbar: (message: string) => void;
} | null>(null);

const TIMEOUT = 2000;

type Toast = {
    id: number;
    message: string;
}

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);

    if (context === null) {
        throw new Error('useSnackbar should be used inside SnackbarProvider');
    }

    return context;
}

export default function SnackbarProvider({ children }: { children: ReactNode }) {
    const timeoutIds = useRef<number[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const toastIdCounter = useRef(0);

    const showSnackbar = useCallback((message: string) => {
        const newToast = { message, id: toastIdCounter.current++ };

        setToasts(prev => [...prev, newToast]);

        const timeoutId = window.setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast !== newToast));
        }, TIMEOUT);

        timeoutIds.current.push(timeoutId);
    }, []);

    useEffect(() => {
        return () => {
            timeoutIds.current.forEach(timeoutId => clearTimeout(timeoutId));
        }
    }, []);

    const contextValue = useMemo(() => ({ showSnackbar }), [showSnackbar]);

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            <div className="fixed bottom-3 w-full flex flex-col gap-3 items-center">
                {toasts.map(toast => (
                    <div key={toast.id} className="px-4 py-2 border border-red-700 rounded w-2/6 bg-red-100">
                        {toast.message}
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    )
}


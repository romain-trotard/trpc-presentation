import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Snackbar = {
    id: number;
    message: string;
    status: 'error' | 'success'
}

const SnackbarContext = React.createContext<{
    showSnackbar: (snackbar: Pick<Snackbar, 'message' | 'status'>) => void;
} | null>(null);

const TIMEOUT = 2000;

const snackbarClassesByStatus: Record<Snackbar['status'], string> = {
    error: 'border-red-700 bg-red-100',
    success: 'border-green-700 bg-green-100',
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
    const [snackbars, setSnackbars] = useState<Snackbar[]>([]);
    const snackbarIdCounter = useRef(0);

    const showSnackbar = useCallback((snackbar: Pick<Snackbar, 'message' | 'status'>) => {
        const newToast = { ...snackbar, id: snackbarIdCounter.current++ };

        setSnackbars(prev => [...prev, newToast]);

        const timeoutId = window.setTimeout(() => {
            setSnackbars(prev => prev.filter(snackbar => snackbar !== newToast));
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
                {snackbars.map(snackbar => (
                    <div key={snackbar.id} className={`px-4 py-2 border rounded w-2/6 ${snackbarClassesByStatus[snackbar.status]}`}>
                        {snackbar.message}
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    )
}


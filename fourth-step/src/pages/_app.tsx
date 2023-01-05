import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import SnackbarProvider from "../components/notifications/SnackbarProvider";

const MyApp: AppType = ({
    Component,
    pageProps
}) => {
    return (
        <SessionProvider>
            <SnackbarProvider>
                <Component {...pageProps} />
            </SnackbarProvider>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);

import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import SnackbarProvider from "../components/notifications/SnackbarProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <SnackbarProvider>
            <Component {...pageProps} />
        </SnackbarProvider>
    );
};

export default trpc.withTRPC(MyApp);

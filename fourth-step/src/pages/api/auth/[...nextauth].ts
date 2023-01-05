import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { serverEnv } from "../../../utils/envVariables"

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: serverEnv.GITHUB_ID,
            clientSecret: serverEnv.GITHUB_SECRET,
        }),
    ],
}

export default NextAuth(authOptions)

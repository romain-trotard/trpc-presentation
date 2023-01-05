# Todos app with tRPC

This project has been generated thanks to [`create-t3-app`](https://create.t3.gg/).

## How to run?

### Prerequisites

1. Install dependencies

First of all, make sure to have installed dependency.

For example using `yarn`:

```bash
yarn
```

2. Then there is some env variables to fill.

- I am using a mysql database managed by [`Prisma`](https://www.prisma.io/docs). Thanks to [`planetscale`](https://planetscale.com/), I can have a free database. 
You can create an account and a database. You will have to get the creadentials to connect to it and fill the followind env variable:

| Variable name | Description |
| ------------- | ----------- |
| DATABASE_URL | This is the url to connect to the database. If you use planetscale, this value can be gotten thanks to the **Connect** button. | 

> **Note:** If you use **Planetscale** you will have to connect to the database in a terminal thanks to: `pscale connect yourDatabaseName`.

Then you need to push the schema:

```bash
yarn schema:push
```

> **Note:** The schema should be already be generated.

- I am using [`NextAuth.js`](https://next-auth.js.org/) to do some authentification with **Github**. To make it works you will have to create 
a **Github Apps** (under `Developper settings`).

You have to fill the **Callback URL** with: `http://localhost:3000/`. And generate **Client Secrets** that you will put in `.env` file:


| Variable name | Description |
| ------------- | ----------- |
| GITHUB_ID | The **Client ID** value. |
| GITHUB_SECRET | The generated **Client Secret** value. |
| NEXTAUTH_SECRET | Used to encrypt JWT token. You can generate one thanks to `openssl rand -base64 32` |
| NEXTAUTH_URL | The canonical URL of the site. (in local: `http://localhost:3000/`) |


### Run in development mode

To run the app locally you just have to launch:

```bash
yarn dev
```

### Run in production mode

First you need to build the app:

```bash
yarn build
```

Then you can run the server:

```bash
yarn start
```


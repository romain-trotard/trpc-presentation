# Second configuration of tRPC

It contains a simple configuration of tRPC without any front libraries / framework.

It implements API for a really simple TODO list. The API are:
- get all todos:

```bash
curl -X GET http://localhost:9000/getAllTodos
```

- add a todo:
```bash
curl -X POST http://localhost:9000/addTodo -d '{"id":2,"name":"A Second todo"}'
```

> **Note:** 
> - Everything is done in memory, so when you restart the server you will lost 
all the todos added
> - no schema validator library used

## How to run?

First you have to install all the dependency:

```bash
yarn
```

Then first run the server:

```bash
yarn run:server
```

Then you can run the client:

```bash
yarn run:client
```


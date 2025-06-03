import express from "express"
import { errorMiddleWare, middlewareLogResponses } from "./api/middlewares.js"
import { config } from "./config.js"
import { handlerReadiness } from "./api/readiness.js"
import postgres from "postgres"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js"
import {
  handlerLogin,
  handlerRefresh,
  handlerRegister,
  handlerRevoke,
} from "./api/auth.js"
import {
  handlerTodoCreate,
  handlerTodoDelete,
  handlerTodosGet,
  handlerTodosRetrieve,
  handlerTodoUpdate,
} from "./api/todos.js"
import { handlerReset } from "./api/reset.js"

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express()

app.use(express.json())
app.use(middlewareLogResponses)

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res).catch(next))
})

// admin
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next)
})

// auth
app.post("/api/register", (req, res, next) => {
  Promise.resolve(handlerRegister(req, res).catch(next))
})

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res).catch(next))
})

app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next)
})

app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next)
})

// todo
app.post("/api/todos", (req, res, next) => {
  Promise.resolve(handlerTodoCreate(req, res).catch(next))
})

app.put("/api/todos/:id", (req, res, next) => {
  Promise.resolve(handlerTodoUpdate(req, res).catch(next))
})

app.delete("/api/todos/:id", (req, res, next) => {
  Promise.resolve(handlerTodoDelete(req, res).catch(next))
})

app.get("/api/todos", (req, res, next) => {
  Promise.resolve(handlerTodosRetrieve(req, res).catch(next))
})

app.get("/api/todos/:id", (req, res, next) => {
  Promise.resolve(handlerTodosGet(req, res).catch(next))
})

app.use(errorMiddleWare)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`)
})

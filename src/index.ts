import express from "express"
import { errorMiddleWare, middlewareLogResponses } from "./api/middlewares.js"
import { config } from "./config.js"
import { handlerReadiness } from "./api/readiness.js"
import postgres from "postgres"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js"

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express()

app.use(express.json())
app.use(middlewareLogResponses)

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res).catch(next))
})

app.use(errorMiddleWare)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`)
})

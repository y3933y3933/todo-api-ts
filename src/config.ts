import { type MigrationConfig } from "drizzle-orm/migrator"

process.loadEnvFile()

function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error("env value not found")
  }

  return value
}

type Config = {
  api: APIConfig
  db: DBConfig
  jwt: JWTConfig
}

type APIConfig = {
  port: number
  platform: string
}

type DBConfig = {
  url: string
  migrationConfig: MigrationConfig
}

type JWTConfig = {
  defaultDuration: number
  secret: string
  issuer: string
  refreshDuration: number
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
}

export const config: Config = {
  api: {
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60,
    refreshDuration: 60 * 60 * 24 * 60 * 1000,
    secret: envOrThrow("SECRET"),
    issuer: "todo",
  },
}

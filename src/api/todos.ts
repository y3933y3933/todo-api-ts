import type { Request, Response } from "express"
import { BadRequestError } from "./errors.js"
import { getBearerToken, validateJWT } from "../auth.js"
import { config } from "../config.js"
import { createTodo, getTodos } from "../db/queries/todos.js"
import { respondWithJSON } from "./json.js"

export async function handlerTodoCreate(req: Request, res: Response) {
  type parameters = {
    title: string
    description?: string
  }

  const params: parameters = req.body
  if (!params.title) {
    throw new BadRequestError("Missing required fields")
  }

  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)

  const cleaned = validateTodo(params.title)

  const todo = await createTodo({
    userId,
    title: cleaned,
    description: params.description,
  })

  respondWithJSON(res, 201, todo)
}

function validateTodo(title: string) {
  const maxTodoLength = 255
  if (title.length > maxTodoLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxTodoLength}`
    )
  }

  return title.trim()
}

export async function handlerTodoUpdate(req: Request, res: Response) {}

export async function handlerTodoDelete(req: Request, res: Response) {}

export async function handlerTodosRetrieve(_: Request, res: Response) {
  const todos = await getTodos()
  respondWithJSON(res, 200, todos)
}

export async function handlerTodosGet(req: Request, res: Response) {}

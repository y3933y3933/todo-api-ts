import type { Request, Response } from "express"
import { BadRequestError, NotFoundError, UserForbiddenError } from "./errors.js"
import { getBearerToken, validateJWT } from "../auth.js"
import { config } from "../config.js"
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../db/queries/todos.js"
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

export async function handlerTodoUpdate(req: Request, res: Response) {
  const { id } = req.params
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)

  const todo = await getTodo(id)
  if (!todo) {
    throw new NotFoundError(`Todo with todoID: ${id} not found`)
  }

  if (todo.userId !== userId) {
    throw new UserForbiddenError("You can't delete this chirp")
  }

  type parameters = {
    title: string
    description?: string
  }

  const params: parameters = req.body
  if (!params.title) {
    throw new BadRequestError("Missing required fields")
  }
  const cleaned = validateTodo(params.title)

  const updated = await updateTodo({
    id,
    title: cleaned,
    description: params.description,
  })

  respondWithJSON(res, 200, updated)
}

export async function handlerTodoDelete(req: Request, res: Response) {
  const { id } = req.params
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)

  const todo = await getTodo(id)
  if (!todo) {
    throw new NotFoundError(`Todo with todoID: ${id} not found`)
  }

  if (todo.userId !== userId) {
    throw new UserForbiddenError("You can't delete this chirp")
  }

  const deleted = await deleteTodo(id)
  if (!deleted) {
    throw new Error(`Failed to delete todo with todoID: ${id}`)
  }

  respondWithJSON(res, 204, { message: "delete todo success" })
}

export async function handlerTodosRetrieve(_: Request, res: Response) {
  const todos = await getTodos()
  respondWithJSON(res, 200, todos)
}

export async function handlerTodosGet(req: Request, res: Response) {
  const { id } = req.params
  const todo = await getTodo(id)
  if (!todo) {
    throw new NotFoundError(`Todo with todoID: ${id} not found`)
  }

  respondWithJSON(res, 200, todo)
}

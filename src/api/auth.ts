import type { Request, Response } from "express"
import { BadRequestError } from "./errors.js"
import { hashPassword } from "../auth.js"
import { createUser } from "../db/queries/users.js"
import type { NewUser } from "../db/schema.js"
import { respondWithJSON } from "./json.js"

export async function handlerRegister(req: Request, res: Response) {
  type parameters = {
    email: string
    password: string
  }

  const params: parameters = req.body

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields")
  }

  const hashedPassword = await hashPassword(params.password)

  const user = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser)

  if (!user) {
    throw new Error("Could not create user")
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies Omit<NewUser, "hashedPassword">)
}

export async function handlerLogin(req: Request, res: Response) {}

export async function handlerRefresh(req: Request, res: Response) {}

export async function handlerRevoke(req: Request, res: Response) {}

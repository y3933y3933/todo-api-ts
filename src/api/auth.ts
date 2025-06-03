import type { Request, Response } from "express"
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js"
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  makeRefreshToken,
} from "../auth.js"
import { createUser, getUserByEmail } from "../db/queries/users.js"
import type { NewUser } from "../db/schema.js"
import { respondWithJSON } from "./json.js"
import { config } from "../config.js"
import {
  revokeRefreshToken,
  saveRefreshToken,
  userForRefreshToken,
} from "../db/queries/refresh.js"

type UserResponse = Omit<NewUser, "hashedPassword">

type LoginResponse = UserResponse & {
  token: string
  refreshToken: string
}

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
  } satisfies UserResponse)
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string
    password: string
  }

  const params: parameters = req.body

  const user = await getUserByEmail(params.email)
  if (!user) {
    throw new UserNotAuthenticatedError("invalid username or password")
  }

  const isMatch = await checkPasswordHash(params.password, user.hashedPassword)
  if (!isMatch) {
    throw new UserNotAuthenticatedError("invalid username or password")
  }

  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  )

  const refreshToken = makeRefreshToken()
  const saved = await saveRefreshToken(user.id, refreshToken)
  if (!saved) {
    throw new UserNotAuthenticatedError("could not save refresh token")
  }

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken: refreshToken,
  } satisfies LoginResponse)
}

export async function handlerRefresh(req: Request, res: Response) {
  let refreshToken = getBearerToken(req)

  const result = await userForRefreshToken(refreshToken)
  if (!result) {
    throw new UserNotAuthenticatedError("invalid refresh token")
  }

  const user = result.user
  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  )

  type response = {
    token: string
  }

  respondWithJSON(res, 200, {
    token: accessToken,
  } satisfies response)
}

export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req)
  await revokeRefreshToken(refreshToken)
  res.status(204).send()
}

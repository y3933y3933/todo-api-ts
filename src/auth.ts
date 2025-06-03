import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt, { JwtPayload } from "jsonwebtoken"
import { BadRequestError, UserNotAuthenticatedError } from "./api/errors.js"
import { config } from "./config.js"
import type { Request } from "express"

export async function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

type payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + expiresIn

  const token = jwt.sign(
    {
      iss: config.jwt.issuer,
      sub: userID,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies payload,
    secret,
    { algorithm: "HS256" }
  )

  return token
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: payload
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload
  } catch (e) {
    throw new UserNotAuthenticatedError("Invalid token")
  }

  if (decoded.iss !== config.jwt.issuer) {
    throw new UserNotAuthenticatedError("Invalid issuer")
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token")
  }

  return decoded.sub
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex")
}

export function getBearerToken(req: Request) {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    throw new BadRequestError("Malformed authorization header")
  }

  return extractBearerToken(authHeader)
}

export function extractBearerToken(header: string) {
  const splitAuth = header.split(" ")
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header")
  }
  return splitAuth[1]
}

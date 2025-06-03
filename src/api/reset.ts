import type { Request, Response } from "express"
import { config } from "../config.js"
import { UserForbiddenError } from "./errors.js"
import { reset } from "../db/queries/users.js"
import { respondWithJSON } from "./json.js"

export async function handlerReset(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    console.log(config.api.platform)
    throw new UserForbiddenError("Reset is only allowed in dev environment.")
  }

  await reset()
  respondWithJSON(res, 200, { message: "reset success" })
}

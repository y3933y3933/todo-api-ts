import type { NextFunction, Request, Response } from "express"
import { BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError } from "./errors.js"
import { respondWithError } from "./json.js"


export function middlewareLogResponses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.on("finish", () => {
      if (res.statusCode >= 300) {
        console.log(
          `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
        )
      }
    })
    next()
  }


  export function errorMiddleWare(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction
  ) {
    let statusCode = 500
    let message = "Something went wrong on our end"
  
    if (err instanceof BadRequestError) {
      statusCode = 400
      message = err.message
    } else if (err instanceof UserNotAuthenticatedError) {
      statusCode = 401
      message = err.message
    } else if (err instanceof UserForbiddenError) {
      statusCode = 403
      message = err.message
    } else if (err instanceof NotFoundError) {
      statusCode = 404
      message = err.message
    }
  
    if (statusCode >= 500) {
      console.log(err.message)
    }
  
    respondWithError(res, statusCode, message)
  }
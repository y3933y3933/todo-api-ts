import type { NextFunction, Request, Response } from "express"


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
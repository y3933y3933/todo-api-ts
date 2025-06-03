import type { Request, Response } from "express"
import { respondWithJSON } from "./json.js"
import { config } from "../config.js"

export async function handlerReadiness(_: Request, res: Response) {
    respondWithJSON(res, 200, {
        "env":    config.api.platform,
        "status": "available",
    })

}

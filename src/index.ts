import express from "express";
import { errorMiddleWare, middlewareLogResponses } from "./api/middlewares.js";
import { config } from "./config.js";

const app = express();

app.use(express.json())
app.use(middlewareLogResponses)


app.use(errorMiddleWare)

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`)
  })
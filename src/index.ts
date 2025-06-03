import express from "express";
import { errorMiddleWare, middlewareLogResponses } from "./api/middlewares.js";

const app = express();

app.use(express.json())
app.use(middlewareLogResponses)


app.use(errorMiddleWare)

app.listen(8080)
import express from "express";
import { middlewareLogResponses } from "./api/middlewares";

const app = express();

app.use(express.json())
app.use(middlewareLogResponses)

app.listen(8080)
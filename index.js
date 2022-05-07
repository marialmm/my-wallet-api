import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";

import {signUp, login} from "./controllers/userController.js";
import registryRouter from "./routes/registryRouter.js";


dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.use(registryRouter)

app.post("/sign-up", signUp);

app.post("/login", login);



app.listen(5000, () =>
    console.log(chalk.green("Server listening on port 5000"))
);

import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";

import db from "./db.js"
import {signUp, login} from "./controllers/userController.js"
import { getRegistry, sendRegister } from "./controllers/registryController.js";

dotenv.config();

const app = express();


app.use(json());
app.use(cors());

app.post("/sign-up", signUp);

app.post("/login", login);

app.get("/registry", getRegistry);

app.post("/registry", sendRegister);

app.listen(5000, () =>
    console.log(chalk.green("Server listening on port 5000"))
);

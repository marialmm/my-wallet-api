import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";

import userRouter from "./routes/userRouter.js";
import transactionsRouter from "./routes/transactionsRouter.js";


dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.use(userRouter);
app.use(transactionsRouter);

const PORT = process.env.PORT || 5000;

app.listen(5000, () =>
    console.log(chalk.green(`Server is running on port ${PORT}`))
);

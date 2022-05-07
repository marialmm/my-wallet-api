import chalk from "chalk";
import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express, { json } from "express";
import joi from "joi";
import { v4 as uuid } from "uuid";

import db from "./db.js"
import {SignUp, Login} from "./controllers/userController.js"

dotenv.config();

const app = express();


app.use(json());
app.use(cors());

app.post("/sign-up", SignUp);

app.post("/login", Login);

app.get("/registry", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const session = await db.collection("sessions").findOne({ token });
        console.log;

        if (!session) {
            res.sendStatus(401);
            return;
        }

        const user = await db
            .collection("users")
            .findOne({ _id: session.userId });

        if (!user) {
            res.sendStatus(404);
            return;
        }

        delete user.password;
        delete user._id;
        delete user.email;

        res.send(user);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post("/registry", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const body = req.body;

    const registerSchema = joi.object({
        description: joi.string().required(),
        value: joi.number().required(),
        type: joi.string().valid("income", "expense").required()
    });

    const validation = registerSchema.validate(body, {abortEarly: false});

    if(validation.error){
        console.log(validation.error.details.map((detail) => detail.message));
        res.sendStatus(422);
        return;
    }

    body.date = dayjs().format("DD/MM");

    try {
        const session = await db.collection("sessions").findOne({ token });
        console.log;

        if (!session) {
            res.sendStatus(401);
            return;
        }

        const user = await db
            .collection("users")
            .findOne({ _id: session.userId });

        if (!user) {
            res.sendStatus(404);
            return;
        }

        user.registry.push(body);

        await db.collection("users").updateOne({_id: user._id}, {$set: user});

        res.sendStatus(201);

    } catch (e) {
        res.sendStatus(500);
        console.log(e);
    }
});

app.listen(5000, () =>
    console.log(chalk.green("Server listening on port 5000"))
);

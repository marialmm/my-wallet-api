import bcrypt from "bcrypt";
import chalk from "chalk";
import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express, { json } from "express";
import joi from "joi";
import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";

import {SignUp} from "./controllers/userController.js"

dotenv.config();

const app = express();
const mongoClient = new MongoClient(process.env.MONGO_URL);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db(process.env.DATABASE);
});

app.use(json());
app.use(cors());

app.post("/sign-up", SignUp);

app.post("/login", async (req, res) => {
    const body = req.body;

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    const validation = loginSchema.validate(body, {abortEarly: false});

    if (validation.error) {
        console.log(validation.error.details.map((detail) => detail.message));
        res.sendStatus(422);
        return;
    }

    try {
        const user = await db
            .collection("users")
            .findOne({ email: body.email });

        if (user && bcrypt.compareSync(body.password, user.password)) {
            const token = uuid();
            await db.collection("sessions").insertOne({
                userId: user._id,
                token,
            });

            res.status(200).send(token);
        } else {
            res.sendStatus(401);
        }
    } catch (erro) {
        console.log(erro);
        res.sendStatus(500);
    }
});

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

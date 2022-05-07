import bcrypt from "bcrypt";
import chalk from "chalk";
import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express, { json } from "express";
import joi from "joi";
import { MongoClient } from "mongodb";
import { v4 as uuid } from 'uuid';

dotenv.config();

const app = express();
const mongoClient = new MongoClient(process.env.MONGO_URL);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db(process.env.DATABASE);
});

app.use(json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
    const body = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    const validate = userSchema.validate(body);

    if (validate.error) {
        console.log(validate.error.details.map((detail) => detail.message));
        res.sendStatus(422);
        return;
    }

    body.password = bcrypt.hashSync(body.password, 10);

    try {
        const user = await db
            .collection("users")
            .findOne({ email: body.email });
        const users = await db.collection("users").find({});
        console.log(users);

        if (user) {
            res.status(422).send("Email já cadastrado");
            return;
        }

        await db.collection("users").insertOne({ ...body });

        res.status(201).send("Cadastro realizado com sucesso!");
    } catch {
        res.sendStatus(500);
    }
});

app.post("/login", async (req, res) => {
    const body = req.body;

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    const validation = loginSchema.validate(body);

    if (validation.error) {
        console.log(validation.error.details.map((detail) => detail.message));
        res.sendStatus(422);
    }

    try {
        const user = await db
            .collection("users")
            .findOne({ email: body.email });

        if (user && bcrypt.compareSync(body.password, user.password)) {
            const token = uuid();
            await db.collection("sections").insertOne({
                userId: user._id,
                token
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
    console.log(chalk.blue("Registro coletado com sucesso!"));
    res.send("Registro coletado com sucesso!");
});

app.post("/registry", async (req, res) => {
    console.log(chalk.blue("Registro realizado com sucesso!"));
    res.send("Registro realizado com sucesso!");
});

app.listen(5000, () =>
    console.log(chalk.green("Server listening on port 5000"))
);

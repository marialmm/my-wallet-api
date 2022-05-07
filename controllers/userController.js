import joi from "joi";
import bcrypt from "bcrypt";
import chalk from "chalk";
import { v4 as uuid } from "uuid";

import db from "./../db.js";

export async function signUp(req, res){
    const body = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    const validate = userSchema.validate(body, {abortEarly: false});

    if (validate.error) {
        console.log(validate.error.details.map((detail) => detail.message));
        res.sendStatus(422);
        return;
    }

    body.password = bcrypt.hashSync(body.password, 10);

    try {
        console.log(chalk.blue("Conectando no db"))
        const user = await db
            .collection("users")
            .findOne({ email: body.email });
        const users = await db.collection("users").find({});

        console.log(chalk.blue("usuario procurado"));

        if (user) {
            res.status(409).send("Email já cadastrado");
            return;
        }

        await db.collection("users").insertOne({ ...body, registry: [] });

        res.status(201).send("Cadastro realizado com sucesso!");
    } catch {
        res.sendStatus(500);
    }
}

export async function login(req, res){
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
}
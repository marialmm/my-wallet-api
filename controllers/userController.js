import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from "./../db.js";

export async function signUp(req, res){
    const body = req.body;

    body.password = bcrypt.hashSync(body.password, 10);

    try {
        const user = await db
            .collection("users")
            .findOne({ email: body.email });
        const users = await db.collection("users").find({});

        if (user) {
            res.status(409).send("Email já cadastrado");
            return;
        }

        await db.collection("users").insertOne({ ...body, transactions: [] });

        res.status(201).send("Cadastro realizado com sucesso!");
    } catch {
        res.sendStatus(500);
    }
}

export async function login(req, res){
    const body = req.body;

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

export async function logout(req, res){
    const token = res.locals.token;

    try{
        await db.collection("sessions").deleteOne({token});
        res.sendStatus(200);
    } catch (erro) {
        console.log(erro);
        res.sendStatus(500);
    }
}
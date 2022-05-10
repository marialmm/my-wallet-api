import joi from "joi";
import dayjs from "dayjs";

import db from "./../db.js";

export async function getTransactions(req, res) {
    const user = res.locals.user;

    delete user.password;
    delete user._id;
    delete user.email;

    res.send(user);
}

export async function sendTransaction(req, res) {
    const body = req.body;
    const user = res.locals.user;

    body.date = dayjs().format("DD/MM");

    try {
        user.transactions.push(body);

        await db
            .collection("users")
            .updateOne({ _id: user._id }, { $set: user });

        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
        console.log(e);
    }
}

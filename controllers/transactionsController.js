import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

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
    body.id = uuid();

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

export async function deleteTransaction(req, res){
    const id = req.params.idTransaction;
    const user = res.locals.user;

    user.transactions = user.transactions.filter(transaction => transaction.id !== id);
    try{
        await db.collection("users").updateOne({_id: user._id}, {$set: user});
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
        console.log(e);
    }
}

export async function editTransaction(req, res){
    const body = req.body;
    const id = req.params.idTransaction;
    const user = res.locals.user;

    user.transactions.forEach(transaction => {
        if(transaction.id === id){
            transaction.value = body.value;
            transaction.description = body.description;
        }
    })

    try{
        await db.collection("users").updateOne({_id: user._id }, { $set: user});
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
        console.log(e);
    }
}
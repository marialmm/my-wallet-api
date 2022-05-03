import bcrypt from "bcrypt";
import chalk from "chalk";
import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express, {json} from "express";
import joi from "joi";
import mongodb from "mongodb";

const app = express();

app.use(json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
    console.log(chalk.blue("Cadastro realizado com sucesso!"));
    res.send("Cadastro realizado com sucesso!");
});

app.post("/login", async (req, res) => {
    console.log(chalk.blue("Login realizado com sucesso!"));
    res.send("Login realizado com sucesso!");
});

app.get("/registry", async (req, res) => {
    console.log(chalk.blue("Registro coletado com sucesso!"));
    res.send("Registro coletado com sucesso!");
});

app.post("/registry", async (req, res) =>{
    console.log(chalk.blue("Registro realizado com sucesso!"));
    res.send("Registro realizado com sucesso!");
});

app.listen(5000, () => console.log(chalk.green("Server listening on port 5000")));
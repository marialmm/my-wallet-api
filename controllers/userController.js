import joi from "joi";
import bcrypt from "bcrypt";
import chalk from "chalk";

export async function SignUp(req, res){
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
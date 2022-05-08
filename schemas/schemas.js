import joi from "joi";

export const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export const registerSchema = joi.object({
    description: joi.string().required(),
    value: joi.number().required(),
    type: joi.string().valid("income", "expense").required()
});
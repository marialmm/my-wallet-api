import { Router } from "express";

import { signUp, login } from "./../controllers/userController.js";
import { userSchema, loginSchema } from "./../schemas/schemas.js";
import { schemaValidation } from "../middlewares/validationMiddlewares.js";

const userRouter = Router();

userRouter.post(
    "/sign-up",
    (req, res, next) => {
        schemaValidation(req, res, next, userSchema);
    },
    signUp
);
userRouter.post(
    "/login",
    (req, res, next) => {
        schemaValidation(req, res, next, loginSchema);
    },
    login
);

export default userRouter;

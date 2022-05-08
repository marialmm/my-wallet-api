import { Router } from "express";

import { signUp, login } from "./../controllers/userController.js";
import { userSchema, loginSchema } from "./../schemas/schemas.js";
import { validateSchema } from "../middlewares/validationMiddlewares.js";

const userRouter = Router();

userRouter.post(
    "/sign-up",
    (req, res, next) => {
        validateSchema(req, res, next, userSchema);
    },
    signUp
);
userRouter.post(
    "/login",
    (req, res, next) => {
        validateSchema(req, res, next, loginSchema);
    },
    login
);

export default userRouter;

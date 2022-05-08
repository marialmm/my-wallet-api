import { Router } from "express";

import {
    getRegistry,
    sendRegister,
} from "./../controllers/registryController.js";
import { validateSchema } from "../middlewares/validationMiddlewares.js";
import { registerSchema } from "../schemas/schemas.js";
import { validateToken } from "../middlewares/authMiddleware.js";

const registryRouter = Router();

registryRouter.use(validateToken);

registryRouter.get("/registry", getRegistry);

registryRouter.post(
    "/registry",
    (req, res, next) => {
        validateSchema(req, res, next, registerSchema);
    },
    sendRegister
);

export default registryRouter;

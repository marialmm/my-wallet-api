import { Router } from "express";

import {
    getRegistry,
    sendRegister,
} from "./../controllers/registryController.js";
import { schemaValidation } from "../middlewares/validationMiddlewares.js";
import { registerSchema } from "../schemas/schemas.js";

const registryRouter = Router();

registryRouter.get("/registry", getRegistry);

registryRouter.post(
    "/registry",
    (req, res, next) => {
        schemaValidation(req, res, next, registerSchema);
    },
    sendRegister
);

export default registryRouter;

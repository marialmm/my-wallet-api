import {Router} from "express";

import { getRegistry, sendRegister } from "./../controllers/registryController.js";

const registryRouter = Router();

registryRouter.get("/registry", getRegistry);

registryRouter.post("/registry", sendRegister);

export default registryRouter;
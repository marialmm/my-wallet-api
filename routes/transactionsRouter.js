import { Router } from "express";

import {
    getTransactions,
    sendTransaction,
} from "./../controllers/transactionsController.js";
import { validateSchema } from "../middlewares/validationMiddlewares.js";
import { transactionsSchema } from "../schemas/schemas.js"; 
import { validateToken } from "../middlewares/authMiddleware.js";

const transactionsRouter = Router();

transactionsRouter.use(validateToken);

transactionsRouter.get("/transactions", getTransactions);

transactionsRouter.post(
    "/transactions",
    (req, res, next) => {
        validateSchema(req, res, next, transactionsSchema);
    },
    sendTransaction
);

export default transactionsRouter;

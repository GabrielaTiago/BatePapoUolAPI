import { Router } from "express";
import { createMessage, getAllMessages } from "../controllers/messagesControllers.js";
import { validatesSchemas } from "../middlewares/validateSchemas.js";

const messagesRouter = Router();

messagesRouter.post("/messages", validatesSchemas("message"), createMessage);
messagesRouter.get("/messages", getAllMessages);


export { messagesRouter };

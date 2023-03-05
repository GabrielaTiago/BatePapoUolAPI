import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  editMessage,
} from "../controllers/messagesControllers.js";
import { validatesSchemas } from "../middlewares/validateSchemas.js";

const messagesRouter = Router();

messagesRouter.post("/messages", validatesSchemas("message"), createMessage);
messagesRouter.get("/messages", getAllMessages);
messagesRouter.delete("/messages/:id", deleteMessage);
messagesRouter.put("/messages/:id", validatesSchemas("message"), editMessage);

export { messagesRouter };

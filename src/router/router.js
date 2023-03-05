import { Router } from "express";
import { messagesRouter } from "./messagesRouter.js";
import { participantsRouter } from "./participantsRouter.js";
import { statusRouter } from "./statusRouter.js";

const router = Router();

router.use(participantsRouter);
router.use(messagesRouter);
router.use(statusRouter);

export { router };

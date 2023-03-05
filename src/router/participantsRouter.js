import { Router } from "express";
import {
  getAllParticipants,
  registerParticipant,
} from "../controllers/participantsControllers.js";
import { validatesSchemas } from "../middlewares/validateSchemas.js";

const participantsRouter = Router();

participantsRouter.post(
  "/participants",
  validatesSchemas("participant"),
  registerParticipant
);
participantsRouter.get("/participants", getAllParticipants);

export { participantsRouter };

import { Router } from "express";
import { updateParticipantStatus } from "../controllers/statusController.js";

const statusRouter = Router();

statusRouter.post("/status", updateParticipantStatus)

export { statusRouter };

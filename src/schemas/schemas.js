import { messageSchema } from "./messageSchema.js";
import { participantSchema } from "./participantSchema.js";

const schemas = {
  participant: participantSchema,
  message: messageSchema,
};

export { schemas };

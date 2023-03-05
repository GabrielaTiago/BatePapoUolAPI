import { statusServices } from "../services/statusServices.js";

export async function updateParticipantStatus(req, res) {
  const { user: name } = req.headers;

  await statusServices.updateParticipantStatus(name);

  res.sendStatus(200);
}

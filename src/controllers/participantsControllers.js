import { participantsServices } from "../services/partcipantsServices.js";

export async function registerParticipant(req, res) {
  const { name } = req.body;

  await participantsServices.registerParticipant(name);

  res.status(201).send("OK");
}

export async function getAllParticipants(req, res) {
  const allParticipants = await participantsServices.getAllParticipants();

  res.status(201).send(allParticipants);
}

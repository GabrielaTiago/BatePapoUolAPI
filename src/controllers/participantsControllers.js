import { participantsServices } from "../services/partcipantsServices.js";

export async function registerParticipant(req, res) {
  const { name } = req.body;

  const data = await participantsServices.registerParticipant(name);

  res.status(201).send(data);
}

export async function getAllParticipants(req, res) {
  const allParticipants = await participantsServices.getAllParticipants();

  res.status(201).send(allParticipants);
}

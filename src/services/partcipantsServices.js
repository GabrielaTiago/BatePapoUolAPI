import { messagesRepositories } from "../repositories/messagesRepository.js";
import { participantsRepositories } from "../repositories/participantsRepository.js";
import { now, formatTime } from "../utils/timeFormatting.js";

async function registerParticipant(name) {
  const time = now();
  const formatedTime = formatTime();
  const statusMessage = {
    from: name,
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    time: formatedTime,
  };
  const userExists = await participantsRepositories.findUserByName(name);

  if (userExists) {
    const error = { type: "conflict", message: "User already exists" };
    throw error;
  }

  await Promise.all([
    participantsRepositories.createUser(name, time),
    messagesRepositories.createMessage(statusMessage),
  ]);
}

async function getAllParticipants() {
  const allParticipants = await participantsRepositories.getAllParticipants();
  return allParticipants;
}

export const participantsServices = {
  getAllParticipants,
  registerParticipant,
};

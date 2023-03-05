import { participantsRepositories } from "../repositories/participantsRepository.js";
import { now } from "../utils/timeFormatting.js";

async function updateParticipantStatus(name) {
  const time = now();
  const userExists = await participantsRepositories.findUserByName(name);

  if (!userExists) {
    const error = {
      type: "not_found",
      message: "User not found",
    };
    throw error;
  }

  await participantsRepositories.updateParticipantStatus(name, time);
}

export const statusServices = {
  updateParticipantStatus,
};

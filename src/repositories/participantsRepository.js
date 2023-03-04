import { database } from "../database/mongodb.js";

async function findUserByName(name) {
  const user = await database.collection("participants").findOne({ name });
  return user;
}

async function createUser(name, time) {
  await database
    .collection("participants")
    .insertOne({ name, lastStatus: time });
}

async function getAllParticipants() {
  const allParticipants = await database
    .collection("participants")
    .find()
    .toArray();
  return allParticipants;
}

async function updateParticipantStatus(name, lastStatus) {
  await database.collection("participants").updateOne(
    {
      name,
    },
    { $set: { lastStatus } }
  );
}

async function findTheLatestStatus(currentTime) {
  const latest = await database
    .collection("participants")
    .find({ lastStatus: { $lt: currentTime } })
    .toArray();
  return latest;
}

export const participantsRepositories = {
  createUser,
  findUserByName,
  findTheLatestStatus,
  getAllParticipants,
  updateParticipantStatus,
};

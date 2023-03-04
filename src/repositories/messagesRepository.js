import { database } from "../database/mongodb.js";

async function createMessage({ from, to, text, type, time }) {
  await database.collection("messages").insertOne({
    from,
    to,
    text,
    type,
    time,
  });
}

async function getAllMessages(user) {
  const allMessages = await database
    .collection("messages")
    .find({
      $or: [{ from: user }, { to: user }, { to: "Todos" }],
    })
    .toArray();

  return allMessages;
}

async function leftTheRoomStatusMessages(leftTheRoomMessages) {
  await database.collection("messages").insertMany(leftTheRoomMessages);
}

export const messagesRepositories = {
  createMessage,
  leftTheRoomStatusMessages,
  getAllMessages,
};

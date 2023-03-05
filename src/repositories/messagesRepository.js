import { ObjectId } from "mongodb";
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

async function findMessageById(id) {
  const message = await database
    .collection("messages")
    .findOne({ _id: ObjectId(id) });
  return message;
}

async function deleteMessage(id) {
  await database.collection("messages").deleteOne({ _id: ObjectId(id) });
}

export const messagesRepositories = {
  createMessage,
  deleteMessage,
  findMessageById,
  getAllMessages,
  leftTheRoomStatusMessages,
};

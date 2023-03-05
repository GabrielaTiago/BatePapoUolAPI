import { messagesRepositories } from "../repositories/messagesRepository.js";
import { participantsRepositories } from "../repositories/participantsRepository.js";
import { stripHtmlTags } from "../utils/stripHtmltags.js";
import { formatTime, now } from "../utils/timeFormatting.js";

async function createMessage(from, messageObj) {
  const time = formatTime();
  const text = stripHtmlTags(messageObj.text);
  const message = {
    ...messageObj,
    text: text,
  };

  const userExists = await participantsRepositories.findUserByName(from);

  if (!userExists) {
    const error = {
      type: "not_found",
      message: "User not found",
    };
    throw error;
  }

  await messagesRepositories.createMessage({
    from,
    ...message,
    time,
  });
}

async function getAllMessages(user, limit) {
  const allMessages = await messagesRepositories.getAllMessages(user);

  if (!isNaN(limit) && limit > 0) {
    const limitedMessages = allMessages.slice(-limit);
    return limitedMessages;
  }

  return allMessages;
}

async function checksInactiveUsers() {
  const TIME_FOR_NEW_REQUESTS = 15000;

  setInterval(async () => {
    const TOLERANCE_TIME = 10000;
    const timeLimit = now() - TOLERANCE_TIME;
    let leftTheRoomMessages = [];

    const toBeRemoved = await participantsRepositories.findTheLatestStatus(
      timeLimit
    );

    for (const element of toBeRemoved) {
      leftTheRoomMessages.push({
        from: element.name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: formatTime(),
      });
    }

    if (leftTheRoomMessages.length > 0) {
      await Promise.all([
        messagesRepositories.leftTheRoomStatusMessages(leftTheRoomMessages),
        participantsRepositories.deleteInactiveParticipants(timeLimit),
      ]);
    }
  }, TIME_FOR_NEW_REQUESTS);
}

async function deleteMessage(id, name) {
  const message = await messagesRepositories.findMessageById(id);

  if (!message) {
    const error = { type: "not_found", message: "Message not found" };
    throw error;
  }

  if (message.from !== name) {
    const error = {
      type: "unauthorized",
      message: "User not allowed to delete this message",
    };
    throw error;
  }

  await messagesRepositories.deleteMessage(id);
}

async function editMessage(id, user, messageObj) {
  const time = formatTime();
  const text = stripHtmlTags(messageObj.text);

  const userExists = await participantsRepositories.findUserByName(user);

  if (!userExists) {
    const error = {
      type: "not_found",
      message: "User not found",
    };
    throw error;
  }

  const message = await messagesRepositories.findMessageById(id);

  if (!message) {
    const error = { type: "not_found", message: "Message not found" };
    throw error;
  }

  await messagesRepositories.editMessage(id, text, time);
}

export const messagesServices = {
  checksInactiveUsers,
  createMessage,
  deleteMessage,
  editMessage,
  getAllMessages,
};

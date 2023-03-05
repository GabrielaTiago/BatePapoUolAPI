import "express-async-errors";
import express, { json } from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import cors from "cors";
import dayjs from "dayjs";
import { validatesSchemas } from "./middlewares/validateSchemas.js";
import { participantsRepositories } from "./repositories/participantsRepository.js";
import { messagesRepositories } from "./repositories/messagesRepository.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const server = express();

server.use(json());
server.use(cors());

server.post(
  "/participants",
  validatesSchemas("participant"),
  async (require, response) => {
    const { name } = require.body;
    const time = Date.now();
    const formatedTime = dayjs().format("HH:mm:ss");
    const statusMessage = {
      from: name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: formatedTime,
    };

    const checkUsers = await participantsRepositories.findUserByName(name);

    if (checkUsers) {
      const error = { type: "conflict", message: "User already exists" };
      throw error;
    }

    await participantsRepositories.createUser(name, time);

    await messagesRepositories.createMessage(statusMessage);

    response.status(201).send("ok");
  }
);

server.get("/participants", async (require, response) => {
  const allParticipants = await participantsRepositories.getAllParticipants();

  response.status(201).send(allParticipants);
});

server.post(
  "/messages",
  validatesSchemas("message"),
  async (require, response) => {
    const message = require.body;
    const { user: messageFrom } = require.headers;
    const time = dayjs().format("HH:mm:ss");

    const userExists = await participantsRepositories.findUserByName(
      messageFrom
    );

    if (!userExists) {
      const error = {
        type: "not_found",
        message: "User not found",
      };
      throw error;
    }

    await messagesRepositories.createMessage({
      from: messageFrom,
      ...message,
      time: time,
    });

    response.status(201).send("ok");
  }
);

server.get("/messages", async (require, response) => {
  const limit = parseInt(require.query.limit);
  const { user } = require.headers;

  const allMessages = await messagesRepositories.getAllMessages(user);

  if (limit) {
    const lastMessages = allMessages.slice(-limit);
    response.status(200).send(lastMessages);
  } else {
    response.status(200).send(allMessages);
  }
});

server.post("/status", async (require, response) => {
  const { user: name } = require.headers;
  const time = Date.now();

  const userExists = await participantsRepositories.findUserByName(name);

  if (!userExists) {
    const error = {
      type: "not_found",
      message: "User not found",
    };
    throw error;
  }

  await participantsRepositories.updateParticipantStatus(name, time);

  response.sendStatus(200);
});

const inactivesUsers = async () => {
  let deletedUsers = [];
  const currentTime = Date.now() - 100000;

  const timeSpent = await participantsRepositories.findTheLatestStatus(
    currentTime
  );

  await participantsRepositories.findTheLatestStatus(currentTime);

  for (const element of timeSpent) {
    deletedUsers.push({
      from: element.name,
      to: "Todos",
      text: "sai da sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
    });
  }

  if (deletedUsers.length > 0) {
    await messagesRepositories.leftTheRoomStatusMessages(deletedUsers);
  }
};

setInterval(inactivesUsers, 15000);

server.use(errorHandler);

const PORT = Number(process.env.PORT) || 5500;

server.listen(PORT, () => {
  console.log(chalk.bold.green(`The server is up and runnig on port ${PORT}`));
});

import express, { json } from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import cors from "cors";
import dayjs from "dayjs";
import { validatesSchemas } from "./middlewares/validateSchemas.js";
import { participantsRepositories } from "./repositories/participantsRepository.js";
import { messagesRepositories } from "./repositories/messagesRepository.js";

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

    try {
      const checkUsers = await participantsRepositories.findUserByName(name);

      if (checkUsers) {
        response.status(409).send("Usuário já existe");
        return;
      }

      await participantsRepositories.createUser(name, time);

      await messagesRepositories.createMessage(statusMessage);

      response.status(201).send("ok");
    } catch (error) {
      response.status(422).send(error);
    }
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

    try {
      const userExists = await participantsRepositories.findUserByName(
        messageFrom
      );

      if (!userExists) {
        response.status(422).send("Usuário não encontrado");
        return;
      }

      await messagesRepositories.createMessage({
        from: messageFrom,
        ...message,
        time: time,
      });

      response.status(201).send("ok");
    } catch (error) {
      response.status(422).send(error);
    }
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

  try {
    const participants = await participantsRepositories.findUserByName(name);

    if (!participants) {
      response.status(404).send("Participante não encontrado");
      return;
    }

    await participantsRepositories.updateParticipantStatus(name, time);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
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

const PORT = Number(process.env.PORT) || 5500;

server.listen(PORT, () => {
  console.log(chalk.bold.green(`The server is up and runnig on port ${PORT}`));
});

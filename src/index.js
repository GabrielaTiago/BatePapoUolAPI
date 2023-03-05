import "express-async-errors";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import { validatesSchemas } from "./middlewares/validateSchemas.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { messagesServices } from "./services/messagesServices.js";
import { participantsServices } from "./services/partcipantsServices.js";
import { statusServices } from "./services/statusServices.js";

dotenv.config();

const server = express();

server.use(json());
server.use(cors());

server.post(
  "/participants",
  validatesSchemas("participant"),
  async (require, response) => {
    const { name } = require.body;

    await participantsServices.registerParticipant(name);

    response.status(201).send("ok");
  }
);

server.get("/participants", async (require, response) => {
  const allParticipants = await participantsServices.getAllParticipants();

  response.status(201).send(allParticipants);
});

server.post(
  "/messages",
  validatesSchemas("message"),
  async (require, response) => {
    const message = require.body;
    const { user: from } = require.headers;

    await messagesServices.createMessage(from, message);

    response.status(201).send("OK");
  }
);

server.get("/messages", async (require, response) => {
  const limit = parseInt(require.query.limit);
  const { user } = require.headers;

  const messages = await messagesServices.getAllMessages(user, limit);

  response.status(200).send(messages);
});

server.post("/status", async (require, response) => {
  const { user: name } = require.headers;

  await statusServices.updateParticipantStatus(name);

  response.sendStatus(200);
});

messagesServices.checksInactiveUsers();

server.use(errorHandler);

const PORT = Number(process.env.PORT) || 5500;

server.listen(PORT, () => {
  console.log(chalk.bold.green(`The server is up and runnig on port ${PORT}`));
});

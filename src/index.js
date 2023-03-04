import express, { json } from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import cors from "cors";
import dayjs from "dayjs";
import { database } from "./database/mongodb.js";
import { schemas } from "./schemas/schemas.js";

dotenv.config();

const server = express();

server.use(json());
server.use(cors());

server.post("/participants", async (require, response) => {
  const user = require.body;
  const validation = schemas.participant.validate(user, { abortEarly: false });
  const checkUsers = await database
    .collection("participants")
    .findOne({ name: user.name });
  const time = dayjs().format("HH:mm:ss");

  if (validation.error) {
    response.status(422).send("Campo Obrigatório");
    return;
  }
  if (checkUsers) {
    response.status(409).send("Usuário já existe");
    return;
  }

  try {
    await database
      .collection("participants")
      .insertOne({ name: user.name, lastStatus: Date.now() });

    await database.collection("messages").insertOne({
      from: user.name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: time,
    });

    response.status(201).send("ok");
  } catch (error) {
    response.status(422).send(error);
  }
});

server.get("/participants", async (require, response) => {
  const allParticipants = await database
    .collection("participants")
    .find()
    .toArray();
  response.status(201).send(allParticipants);
});

server.post("/messages", async (require, response) => {
  const message = require.body;
  const messageFrom = require.headers.user;
  const validation = schemas.message.validate(message, { abortEarly: false });
  const checkMessage = await database
    .collection("participants")
    .findOne({ name: messageFrom });
  const time = dayjs().format("HH:mm:ss");

  if (validation.error) {
    response.status(422).send("Campos Obrigatórios");
    return;
  }
  if (!checkMessage) {
    response.status(422).send("Usuário não encontrado");
    return;
  }

  try {
    await database.collection("messages").insertOne({
      from: messageFrom,
      ...message,
      time: time,
    });

    response.status(201).send("ok");
  } catch (error) {
    response.status(422).send(error);
  }
});

server.get("/messages", async (require, response) => {
  const limit = parseInt(require.query.limit);

  const allMessages = await database
    .collection("messages")
    .find({
      $or: [
        { to: require.headers.user },
        { from: require.headers.user },
        { to: "Todos" },
      ],
    })
    .toArray();

  if (limit) {
    const lastMessages = allMessages.slice(-limit);
    response.status(200).send(lastMessages);
  } else {
    response.status(200).send(allMessages);
  }
});

server.post("/status", async (require, response) => {
  const user = require.headers.user;
  const participants = await database
    .collection("participants")
    .findOne({ name: user });

  if (!participants) {
    response.status(404).send("Participante não encontrado");
    return;
  }

  try {
    await database
      .collection("participants")
      .updateOne({ name: user }, { $set: { lastStatus: Date.now() } });

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

const inactivesUsers = async () => {
  let deletedUsers = [];
  const currentTime = Date.now() - 100000;

  const timeSpent = await database
    .collection("participants")
    .find({ lastStatus: { $lt: currentTime } })
    .toArray();
  await database
    .collection("participants")
    .deleteMany({ lastStatus: { $lt: currentTime } });

  for (let i = 0; i < timeSpent.length; i++) {
    deletedUsers.push({
      from: timeSpent[i].name,
      to: "Todos",
      text: "sai da sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
    });
  }

  if (deletedUsers.length > 0) {
    await database.collection("messages").insertMany(deletedUsers);
  }
};

setInterval(inactivesUsers, 15000);

const PORT = Number(process.env.PORT) || 5500;

server.listen(PORT, () => {
  console.log(chalk.bold.green(`The server is up and runnig on port ${PORT}`));
});

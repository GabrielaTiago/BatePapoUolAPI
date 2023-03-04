import express, { json } from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import joi from "joi";
import dayjs from "dayjs"

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("BatePapoUOL");
});

const server = express();

server.use(json());
server.use(cors());

const userSchema = joi.object({
    name: joi.string().required()
});

const messageSchema = joi.object({
    from: joi.string(),
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.string().required().valid('private_message', 'message')
});

server.post("/participants", async (require, response) => {
    const user = require.body;
    const validation = userSchema.validate(user, { abortEarly: true });
    const checkUsers = await db.collection("participants").findOne({ name: user.name });
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
        await db
            .collection("participants")
            .insertOne({ name: user.name, lastStatus: Date.now() });

        await db
            .collection("messages")
            .insertOne({
                from: user.name,
                to: 'Todos',
                text: 'entra na sala...',
                type: 'status',
                time: time
            });

        response.status(201).send("ok");

    } catch (error) {
        response.status(422).send(error);
    }
});

server.get("/participants", async (require, response) => {
    const allParticipants = await db.collection("participants").find().toArray();
    response.status(201).send(allParticipants);
});

server.post("/messages", async (require, response) => {
    const message = require.body;
    const messageFrom = require.headers.user;
    const validation = messageSchema.validate(message, { abortEarly: true });
    const checkMessage = await db.collection("participants").findOne({ name: messageFrom });
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
        await db
            .collection("messages")
            .insertOne({
                from: messageFrom,
                ...message,
                time: time
            });

        response.status(201).send("ok");

    } catch (error) {
        response.status(422).send(error);
    }
});

server.get("/messages", async (require, response) => {
    const limit = parseInt(require.query.limit);

    const allMessages = await db
        .collection("messages")
        .find({
            $or:
                [
                    { to: require.headers.user },
                    { from: require.headers.user },
                    { to: "Todos" }
                ]
        })
        .toArray();

    if (limit) {
        const lastMessages = allMessages.slice(-limit);
        response.status(200).send(lastMessages);
    }
    else {
        response.status(200).send(allMessages);
    }
});

server.post("/status", async (require, response) => {
    const user = require.headers.user;
    const participants = await db.collection("participants").findOne({ name: user });

    if (!participants) {
        response.status(404).send("Participante não encontrado");
        return;
    }

    try {
        await db
            .collection("participants")
            .updateOne(
                { "name": user },
                { $set: { "lastStatus": Date.now() } });

        response.sendStatus(200);

    } catch (error) {
        response.status(500).send(error);
    }
});

const inactivesUsers = async () => {
    let deletedUsers = [];
    const currentTime = Date.now() - 100000;

    const timeSpent = await db.collection('participants').find({lastStatus: {$lt : currentTime}}).toArray();
    await db.collection('participants').deleteMany({lastStatus: {$lt : currentTime}});

    for(let i = 0; i < timeSpent.length; i++){
        deletedUsers.push({
            from: timeSpent[i].name,
            to: 'Todos',
            text: 'sai da sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        });
    }

    if(deletedUsers.length > 0){
        await db.collection('messages').insertMany(deletedUsers);
    }
}

setInterval(inactivesUsers, 15000);

const PORT = Number(process.env.PORT) || 5500;

server.listen(PORT, () => {
  console.log(chalk.bold.green(`The server is up and runnig on port ${PORT}`));
});
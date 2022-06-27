import express, { json, response } from "express";
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

const server = express(process.env.MONGO_URI);

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
        console.error(error);
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
        console.error(error);
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

server.listen(5000);
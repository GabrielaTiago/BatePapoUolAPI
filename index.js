import express, { json } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import joi from "joi";

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

server.post("/participants", async (require, response) => {
    const user = require.body;
    const validation = userSchema.validate(user, { abortEarly: true });
    const checkUsers = await db.collection("participants").findOne({ name: user.name });

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

        response.status(201).send("ok");

    } catch (error) {
        console.error(error);
        response.status(422).send(error);
    }
});

server.listen(5000);
import express, { json } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("BatePapoUOL");
});

const server = express(process.env.MONGO_URI);

server.use(json());
server.use(cors());


server.post("/participants", async (require, response) => {
    const { name } = require.body;

    try {
        await db
            .collection("participants")
            .insertOne({ name: name, lastStatus: Date.now() });

        response.status(201).send("ok");
    } catch (error) {
        console.error(error);
        response.status(422).send(error);
    }
});

server.listen(5000);
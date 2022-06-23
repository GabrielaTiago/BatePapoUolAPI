import express from "express";
import dotenv from "dotenv";
import {MongoClient, mongoClient} from "mongodb";


dotenv.config();

const mongoClient = new MongoClient(MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("Bate Papo UOL");
});
const server = express(process.env.MONGO_URI);

server.listen(5000);
import express from "express";
import dotenv from "dotenv";


dotenv.config();

const server = express(process.env.MONGO_URI);

server.listen(5000);
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const uri = process.env.MONGO_URI;
const databaseName = process.env.MONGO_DATABASE_NAME;

let database = null;

const mongoClient = new MongoClient(uri);
const databaseConnection = mongoClient.connect();

databaseConnection
  .then(() => {
    database = mongoClient.db(databaseName);
  })
  .catch((err) => {
    console.error(err);
  });

export { database };

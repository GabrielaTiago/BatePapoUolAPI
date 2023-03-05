import "express-async-errors";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import { router } from "./router/router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { messagesServices } from "./services/messagesServices.js";

dotenv.config();

const server = express();

server.use(json());
server.use(cors());
server.use(router);

messagesServices.checksInactiveUsers();

server.use(errorHandler);

const PORT = Number(process.env.PORT) || 5500;

server.listen(PORT, () => {
  console.log(chalk.bold.green(`The server is up and runnig on port ${PORT}`));
});

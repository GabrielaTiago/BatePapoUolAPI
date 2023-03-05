import { messagesServices } from "../services/messagesServices.js";

export async function createMessage(req, res) {
  const message = req.body;
  const { user: from } = req.headers;

  await messagesServices.createMessage(from, message);

  res.status(201).send("OK");
}

export async function getAllMessages(req, res) {
  const limit = parseInt(req.query.limit);
  const { user } = req.headers;

  const messages = await messagesServices.getAllMessages(user, limit);

  res.status(200).send(messages);
}

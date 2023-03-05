import { ERRORS } from "../errors/serverErrors.js";

export function errorHandler(error, req, res, next) {
  const { type, message } = error;
  const statusCode = ERRORS[type];

  if (statusCode) {
    res.status(statusCode).send(message);
  }

  console.error(error);
  res.status(500).status("Internal Server Error");
}

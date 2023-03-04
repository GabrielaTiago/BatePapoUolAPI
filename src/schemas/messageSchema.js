import joi from "joi";

const messageSchema = joi.object({
  to: joi.string().required().messages({
    'string.empty': `The 'to' value is not allowed to be empty`,
    'any.required': `'to' is a required field`,
  }),
  text: joi.string().required().messages({
    'string.empty': `The 'text' value is not allowed to be empty`,
    'any.required': `'text' is a required field`,
  }),
  type: joi.string().required().valid("private_message", "message") .messages({
    'string.empty': `The 'from' value is not allowed to be empty`,
    'any.required': `'from' is a required field`,
    'any.only': `The type must be one of 'private_message' or 'message'`
  }),
});

export { messageSchema };

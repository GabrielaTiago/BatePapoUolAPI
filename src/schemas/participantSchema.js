import joi from "joi";

const participantSchema = joi.object({
  name: joi.string().trim().required().messages({
    'string.empty': `The 'name' field is not allowed to be empty`,
    'any.required': `'Name' is a required field`,
  }),
});

export { participantSchema };

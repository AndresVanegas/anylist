import * as Joi from 'joi';

export const JoinValidationSchema = Joi.object({
  DB_NAME: Joi.required(),
  PORT: Joi.number().default(3005),
});

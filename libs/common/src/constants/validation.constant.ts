import * as Joi from 'joi'

/*
####### NOTE #######
The `envValidationSchema` object defines the validation rules for environment variables using the `Joi` library. 
Each environment variable listed is required for the application to run properly. This ensures that all necessary 
configuration values are present and valid before the application starts.
*/
export const envValidationSchema = Joi.object({
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().required(),
  MYSQL_USER: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required()
})

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 20

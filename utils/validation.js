import Joi from "joi";

const customMessages = {
  stringPatternBase: "This field must only contain letters",
  passwordPatternBase:
    "Password must contain at least one letter and one number",
};

const commonStringSchema = Joi.string().trim().messages({
  "string.base": "This field must be a string",
  "any.required": "This field is required",
});

const commonEmailSchema = commonStringSchema.email().messages({
  "string.email": "Enter a valid email address",
});

const commonPasswordSchema = commonStringSchema
  .pattern(/[A-Za-z]/, customMessages.stringPatternBase)
  .pattern(/\d/, customMessages.passwordPatternBase)
  .min(8)
  .required()
  .messages({
    "string.min": "Password must contain at least 8 characters",
  });

export const userRegisterSchema = Joi.object({
  username: commonStringSchema
    .pattern(/^[A-Za-z\s]+$/, customMessages.stringPatternBase)
    .min(3)
    .max(25)
    .required()
    .messages({
      "string.min": "Username must contain at least 3 characters",
      "string.max": "Username must contain max 25 characters",
    }),
  email: commonEmailSchema.required(),
  password: commonPasswordSchema,
});

export const userLoginSchema = Joi.object({
  email: commonEmailSchema.required(),
  password: commonPasswordSchema,
});

export const userLogoutSchema = Joi.object().unknown(false).messages({
  "object.unknown": "Body must be empty",
});

export const userSubSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .trim()
    .required()
    .messages({
      "any.only":
        "Subscription must be one of these values - [starter, pro, business]",
    }),
});

export const contactSchema = Joi.object({
  name: commonStringSchema
    .pattern(/^[A-Za-z\s]+$/, customMessages.stringPatternBase)
    .min(3)
    .max(25)
    .required()
    .messages({
      "string.min": "Name must contain at least 3 characters",
      "string.max": "Name must contain max 25 characters",
    }),
  email: commonEmailSchema,
  phone: commonStringSchema
    .pattern(/^[0-9\s+\-()]+$/, customMessages.stringPatternBase)
    .min(3)
    .max(16)
    .required()
    .messages({
      "string.min": "Phone must contain at least 3 characters",
      "string.max": "Phone must contain max 16 characters",
    }),
});

export const contactFavSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "boolean.base": "Favorite must be a boolean",
    "any.required": "Missing field favorite",
  }),
});

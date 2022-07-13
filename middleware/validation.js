const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    family: Joi.required(),
  });
  return schema.validate(data);
};

const registerAccValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.registerAccValidation = registerAccValidation;
module.exports.loginValidation = loginValidation;

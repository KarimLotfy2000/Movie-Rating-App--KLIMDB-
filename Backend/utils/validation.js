const Joi = require("@hapi/joi");

function registerValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().min(10).email(),
    password: Joi.string().min(7),
  });
  return schema.validate(data);
}
function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string().min(2).email(),
    password: Joi.string().min(7),
  });
  return schema.validate(data);
}

function ratingValidation(data) {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).precision(1),
    review: Joi.string(),
    user_id: Joi.number(),
    movie_id: Joi.number(),
  });
  return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.ratingValidation = ratingValidation;

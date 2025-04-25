const Joi = require('joi');

// Validation for user registration
const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });

  validateRequest(req, next, schema);
};

// Validation for user login
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  validateRequest(req, next, schema);
};

// Validation for email (password reset)
const validateEmail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  });

  validateRequest(req, next, schema);
};

// Reusable validation function
function validateRequest(req, next, schema) {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new Error(error.details[0].message));
  }
  next();
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateEmail
};
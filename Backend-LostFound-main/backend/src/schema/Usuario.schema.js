const Joi = require("joi");

const nombre = Joi.string().required();
const email = Joi.string().email().required();
const rol = Joi.string().required();
const contraseña = Joi.string().required();

const usuarioBodySchema = Joi.object({
    nombre,
    email,
    rol,
    contraseña,
});

module.exports = { usuarioBodySchema };
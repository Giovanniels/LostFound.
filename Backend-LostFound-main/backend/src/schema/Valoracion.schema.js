const Joi = require("joi");

const usuarioValorado = Joi.string().min(1);
const usuarioQueValora = Joi.string().min(1);
const puntaje = Joi.string().min(1);
const comentario = Joi.string().min(1);
const fecha = Joi.date().min(1);

const valoracionBodySchema = Joi.object({
    usuarioValorado,
    usuarioQueValora,
    puntaje,
    comentario,
    fecha,
});

module.exports = { valoracionBodySchema };

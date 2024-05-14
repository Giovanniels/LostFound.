
const Joi = require("joi");

const imagen = Joi.string();
const fecha = Joi.date().min(1);
const tipo = Joi.string().min(1);
const descripcion = Joi.string().min(1);
const detalles = Joi.string().min(1);
const ubicacion = Joi.string().min(1);
const activa = Joi.boolean();
const relevante = Joi.boolean();
const informacionContacto = Joi.string();

const objectoEncontradoBodySchema = Joi.object({
    imagen,
    tipo,
    fecha,
    descripcion,
    detalles,
    ubicacion,
    activa,
    relevante,
    informacionContacto,

});

module.exports = { objectoEncontradoBodySchema };

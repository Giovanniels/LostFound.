const Joi = require("joi");

const imagen = Joi.string();
const fecha = Joi.date().min(1);
const tipo = Joi.string().min(1);
const nuevoTipo = Joi.string().allow('').optional(); // Agregar el campo para nuevoTipo
const descripcion = Joi.string().min(1);
const detalles = Joi.string().min(1);
const ubicacion = Joi.string().min(1);
const activa = Joi.boolean();
const relevante = Joi.boolean();
const informacionContacto = Joi.string();

const objectoPerdidoBodySchema = Joi.object({
    imagen,
    tipo,
    nuevoTipo, // Incluir el nuevo campo en el esquema
    fecha,
    descripcion,
    detalles,
    ubicacion,
    activa,
    relevante,
    informacionContacto,
});

module.exports = { objectoPerdidoBodySchema };

const ObjectoPerdido = require("../models/ObjectoPerdido.model");
const { handleError } = require("../utils/errorHandler");
const { objectoPerdidoBodySchema } = require("../schema/ObjectoPerdido.schema");
const Tipo = require('../models/Tipo.model');
const ObjectId = require('mongoose').Types.ObjectId; // Agregar la importación de ObjectId

async function getObjectoPerdidos() {
  try {
    // Obtener todas las publicaciones
    const objectoPerdidos = await ObjectoPerdido.find().populate("tipo");

    // Filtrar las publicaciones activas y relevantes
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Dos semanas en milisegundos
    const activeAndRelevantObjectoPerdidos = objectoPerdidos.filter(objetoPerdido => objetoPerdido.activa && objetoPerdido.relevante && objetoPerdido.fecha >= twoWeeksAgo);

    // Marcar las publicaciones que han caducado como no relevantes
    activeAndRelevantObjectoPerdidos.forEach(objetoPerdido => {
      if (currentDate - objetoPerdido.fecha > 14 * 24 * 60 * 60 * 1000) {
        objetoPerdido.relevante = false;
      }
    });

    // Filtrar las publicaciones activas pero no relevantes
    const activeButNotRelevantObjectoPerdidos = objectoPerdidos.filter(objetoPerdido => objetoPerdido.activa && !objetoPerdido.relevante);

    // Concatenar y devolver las dos listas de publicaciones, priorizando las relevantes
    const prioritizedObjectoPerdidos = activeAndRelevantObjectoPerdidos.concat(activeButNotRelevantObjectoPerdidos);

    return prioritizedObjectoPerdidos;
  } catch (error) {
    handleError(error, "ObjectoPerdido.service -> getObjectoPerdidos");
  }
}

async function buscarObjectoPerdidoPorTipo(tipo) {
  try {
    if (!ObjectId.isValid(tipo)) {
      const tipoExistente = await Tipo.findOne({ nombre: tipo });
      if (!tipoExistente) {
        throw new Error('El tipo de objeto especificado no existe.');
      }
      tipo = tipoExistente._id;
    }

    const objetosPerdidos = await ObjectoPerdido.find({ tipo })
      .populate('tipo');

    return objetosPerdidos;
  } catch (error) {
    console.error('Error al buscar objetos perdidos por tipo:', error);
    throw new Error('Error al buscar objetos perdidos por tipo.');
  }
}

async function createObjectoPerdido(userId, objectoPerdidoData) {
  try {
    const { error } = objectoPerdidoBodySchema.validate(objectoPerdidoData); // Validar los datos del objeto perdido
    if (error) return null;

    const { imagen, fecha, tipo, nuevoTipo, descripcion, detalles, ubicacion, activa, relevante, informacionContacto } = objectoPerdidoData; // Extraer datos del objeto perdido

    let tipoId;

    // Verificar si se proporciona un nuevo tipo
    if (nuevoTipo) {
      // Aquí puedes manejar la lógica para crear un nuevo tipo si es necesario
      // Por ejemplo, puedes verificar si el tipo ya existe antes de crearlo
      // Luego, obtén el ID del tipo creado o existente y úsalo en el objeto perdido
      const existingTipo = await Tipo.findOne({ nombre: nuevoTipo });

      if (existingTipo) {
        tipoId = existingTipo._id;
      } else {
        // Crea un nuevo tipo si no existe
        const newTipo = new Tipo({ nombre: nuevoTipo });
        const savedTipo = await newTipo.save();
        tipoId = savedTipo._id;
      }
    } else {
      tipoId = tipo;
    }

    const newObjectoPerdido = new ObjectoPerdido({ imagen, fecha, tipo: tipoId, descripcion, detalles, ubicacion, activa, relevante, informacionContacto, usuario: userId }); // Crear un nuevo objeto perdido con el userId asociado

    return await newObjectoPerdido.save(); // Guardar el nuevo objeto perdido en la base de datos
  } catch (error) {
    handleError(error, "objectoPerdido.service -> createObjectoPerdido");
  }
}


async function uploadObjectoPerdidoImage(id, imageUrl) {
  try {
      // Actualizamos el objeto perdido con la URL de la imagen
      const updatedObjectoPerdido = await ObjectoPerdido.findByIdAndUpdate(id, { imagen: imageUrl }, { new: true });

      return updatedObjectoPerdido;
  } catch (error) {
      throw new Error("Error al subir la imagen");
  }
}
  
async function getObjectoPerdidoById(id) {
    try {
        return await ObjectoPerdido.findById({ _id: id }).populate("tipo");
    } catch (error) {
        handleError(error, "objectoPerdido.service -> getObjectoPerdidoById");
    }
}


async function updateObjectoPerdido(id, newData) {
    try {
      const objectoPerdido = await ObjectoPerdido.findById(id);
      if (!objectoPerdido) {
        return null;
      }
      // Actualizar los datos del medicamento
      Object.assign(objectoPerdido, newData);
      await objectoPerdido.save();
      return objectoPerdido;
    } catch (error) {
      throw new Error("No se pudo actualizar el objecto Perdido");
    }
  }
  
async function deleteObjectoPerdido(id) {
    try {
        return await ObjectoPerdido.findByIdAndDelete(id);
    } catch (error) {
        handleError(error, "objectoPerdido.service -> deleteObjectoPerdido");
    }
}

async function getObjectoPerdidosByUserId(userId) {
  try {
    return await ObjectoPerdido.find({ usuario: userId }).populate("tipo"); // Buscar publicaciones de objetos perdidos por userId
  } catch (error) {
    handleError(error, "objectoPerdido.service -> getObjectoPerdidosByUserId");
  }
}


module.exports = {
    getObjectoPerdidos,
    createObjectoPerdido,
    getObjectoPerdidoById,
    updateObjectoPerdido,
    deleteObjectoPerdido,
    uploadObjectoPerdidoImage,
    getObjectoPerdidosByUserId,
    buscarObjectoPerdidoPorTipo,
};

const ObjectoEncontrado = require("../models/ObjectoEncontrado.model");
const { handleError } = require("../utils/errorHandler");
const { objectoEncontradoBodySchema } = require("../schema/ObjectoEncontrado.schema");
const Tipo = require('../models/Tipo.model');
const ObjectId = require('mongoose').Types.ObjectId; // Importar ObjectId

async function getObjectoEncontrados() {
  try {
    // Obtener todas las publicaciones
    const objectoEncontrados = await ObjectoEncontrado.find().populate("tipo");

    // Filtrar las publicaciones activas y relevantes
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Dos semanas en milisegundos
    const activeAndRelevantObjectoEncontrados = objectoEncontrados.filter(objetoEncontrado => objetoEncontrado.activa && objetoEncontrado.relevante && objetoEncontrado.fecha >= twoWeeksAgo);

    // Marcar las publicaciones que han caducado como no relevantes
    activeAndRelevantObjectoEncontrados.forEach(objetoEncontrado => {
      if (currentDate - objetoEncontrado.fecha > 14 * 24 * 60 * 60 * 1000) {
        objetoEncontrado.relevante = false;
      }
    });

    // Filtrar las publicaciones activas pero no relevantes
    const activeButNotRelevantObjectoEncontrados = objectoEncontrados.filter(objetoEncontrado => objetoEncontrado.activa && !objetoEncontrado.relevante);

    // Concatenar y devolver las dos listas de publicaciones, priorizando las relevantes
    const prioritizedObjectoEncontrados = activeAndRelevantObjectoEncontrados.concat(activeButNotRelevantObjectoEncontrados);

    return prioritizedObjectoEncontrados;
  } catch (error) {
    handleError(error, "ObjectoEncontrado.service -> getObjectoEncontrados");
  }
}

async function buscarObjectoEncontradoPorTipo(tipo) {
  try {
    if (!ObjectId.isValid(tipo)) {
      const tipoExistente = await Tipo.findOne({ nombre: tipo });
      if (!tipoExistente) {
        throw new Error('El tipo de objeto especificado no existe.');
      }
      tipo = tipoExistente._id;
    }

    const objetosEncontrados = await ObjectoEncontrado.find({ tipo })
      .populate('tipo');

    return objetosEncontrados;
  } catch (error) {
    console.error('Error al buscar objetos encontrados por tipo:', error);
    throw new Error('Error al buscar objetos encontrados por tipo.');
  }
}

async function createObjectoEncontrado(userId, objectoEncontradoData) {
  try {
    const { error } = objectoEncontradoBodySchema.validate(objectoEncontradoData); // Validar los datos del objeto encontrado
    if (error) return null;

    const { imagen, fecha, tipo, nuevoTipo, descripcion, detalles, ubicacion, activa, relevante, informacionContacto } = objectoEncontradoData; // Extraer datos del objeto encontrado

    let tipoId;

    // Verificar si se proporciona un nuevo tipo
    if (nuevoTipo) {
      // Aquí puedes manejar la lógica para crear un nuevo tipo si es necesario
      // Por ejemplo, puedes verificar si el tipo ya existe antes de crearlo
      // Luego, obtén el ID del tipo creado o existente y úsalo en el objeto encontrado
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

    const newObjectoEncontrado = new ObjectoEncontrado({ imagen, fecha, tipo: tipoId, descripcion, detalles, ubicacion, activa, relevante, informacionContacto, usuario: userId }); // Crear un nuevo objeto encontrado con el userId asociado

    return await newObjectoEncontrado.save(); // Guardar el nuevo objeto encontrado en la base de datos
  } catch (error) {
    handleError(error, "ObjectoEncontrado.service -> createObjectoEncontrado");
  }
}

async function uploadObjectoEncontradoImage(id, imageUrl) {
  try {
    // Actualizar el objeto encontrado con la URL de la imagen
    const updatedObjectoEncontrado = await ObjectoEncontrado.findByIdAndUpdate(id, { imagen: imageUrl }, { new: true });

    return updatedObjectoEncontrado;
  } catch (error) {
    throw new Error("Error al subir la imagen");
  }
}

async function getObjectoEncontradoById(id) {
  try {
    return await ObjectoEncontrado.findById({ _id: id }).populate("tipo");
  } catch (error) {
    handleError(error, "ObjectoEncontrado.service -> getObjectoEncontradoById");
  }
}

async function updateObjectoEncontrado(id, newData) {
  try {
    const objectoEncontrado = await ObjectoEncontrado.findById(id);
    if (!objectoEncontrado) {
      return null;
    }
    // Actualizar los datos del objeto encontrado
    Object.assign(objectoEncontrado, newData);
    await objectoEncontrado.save();
    return objectoEncontrado;
  } catch (error) {
    throw new Error("No se pudo actualizar el objeto encontrado");
  }
}

async function deleteObjectoEncontrado(id) {
  try {
    return await ObjectoEncontrado.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "ObjectoEncontrado.service -> deleteObjectoEncontrado");
  }
}

async function getObjectoEncontradosByUserId(userId) {
  try {
    return await ObjectoEncontrado.find({ usuario: userId }).populate("tipo"); // Buscar publicaciones de objetos encontrados por userId
  } catch (error) {
    handleError(error, "ObjectoEncontrado.service -> getObjectoEncontradosByUserId");
  }
}

module.exports = {
  getObjectoEncontrados,
  createObjectoEncontrado,
  getObjectoEncontradoById,
  updateObjectoEncontrado,
  deleteObjectoEncontrado,
  uploadObjectoEncontradoImage,
  getObjectoEncontradosByUserId,
  buscarObjectoEncontradoPorTipo,
};

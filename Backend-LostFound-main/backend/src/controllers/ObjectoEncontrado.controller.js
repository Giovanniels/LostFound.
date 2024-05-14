const { respondSuccess, respondError } = require("../utils/resHandler");
const ObjectoEncontradoService = require("../services/ObjectoEncontrado.service");
const ValoracionService = require("../services/Valoracion.service"); // Asegúrate de importar ValoracionService
const { handleError } = require("../utils/errorHandler");
const ObjectoEncontrado = require("../models/ObjectoEncontrado.model");
const Tipo = require('../models/Tipo.model');

async function getObjectoEncontrados(req, res) {
  try {
    // Obtener todos los objetos encontrados
    const objectoEncontrados = await ObjectoEncontradoService.getObjectoEncontrados();

    // Filtrar y priorizar los objetos según su relevancia y fecha de publicación
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Dos semanas en milisegundos
    const prioritizedObjectoEncontrados = objectoEncontrados.filter(objetoEncontrado => objetoEncontrado.activa && objetoEncontrado.relevante && objetoEncontrado.fecha >= twoWeeksAgo);

    // Devolver la lista de objetos priorizados
    respondSuccess(req, res, 200, prioritizedObjectoEncontrados);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> getObjectoEncontrados");
    respondError(req, res, 500, "No se pudo obtener los objetos encontrados");
  }
}

async function buscarObjectoEncontradoPorTipo(req, res) {
  try {
    const tipo = req.params.tipo; // Usar req.params en lugar de req.query para obtener el tipo de objeto a buscar desde la URL
  
    // Verificar si el tipo proporcionado existe en la base de datos
    const tipoExistente = await Tipo.findOne({ nombre: tipo });
    if (!tipoExistente) {
      return res.status(404).json({ success: false, message: 'El tipo de objeto especificado no existe.' });
    }
  
    // Buscar objetos encontrados que coincidan con el tipo especificado
    const objetosEncontrados = await ObjectoEncontrado.find({ tipo: tipoExistente._id });
  
    // Devolver los objetos encontrados encontrados
    res.status(200).json({ success: true, objetosEncontrados });
  } catch (error) {
    console.error('Error al buscar objetos encontrados:', error);
    res.status(500).json({ success: false, message: 'Error al buscar objetos encontrados.' });
  }
}


async function createObjectoEncontrado(req, res) {
  try {
    const { userId, ...objectoEncontradoData } = req.body;

    // Verificar el promedio de valoración del usuario
    const promedioValoracion = await ValoracionService.obtenerPromedioValoraciones(userId);
    
    // Permitir la creación del objeto encontrado si el promedio de valoraciones es mayor o igual a 3, o si no tiene valoraciones (promedioValoracion === 0)
    if (promedioValoracion >= 3 || promedioValoracion === 0) {
      const nuevoObjectoEncontrado = await ObjectoEncontradoService.createObjectoEncontrado(userId, objectoEncontradoData);
      
      if (!nuevoObjectoEncontrado) {
        return respondError(
          req,
          res,
          400,
          "Error en la validación de datos",
          "Bad Request",
          { message: "Verifique los datos ingresados" }
        );
      }
      
      return respondSuccess(req, res, 201, nuevoObjectoEncontrado);
    }

    // Restricción temporal activa debido a un bajo promedio de valoraciones
    return respondError(req, res, 403, "No puedes publicar debido a un bajo promedio de valoraciones");
    
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> createObjectoEncontrado");
    respondError(req, res, 500, "No se pudo crear el objeto encontrado");
  }
}

async function getObjectoEncontradoById(req, res) {
  try {
    const { id } = req.params;

    const objectoEncontrado = await ObjectoEncontradoService.getObjectoEncontradoById(id);
    objectoEncontrado === null
      ? respondError(
          req,
          res,
          404,
          "No se encontro el objecto encontrado solicitado",
          "Not Found",
          { message: "Verifique el id ingresado" },
        )
      : respondSuccess(req, res, 200, objectoEncontrado);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> getObjectoEncontradoById");
    respondError(req, res, 500, "No se pudo obtener el objecto encontrado");
  }
}

async function updateObjectoEncontrado(req, res) {
  try {
    const { id } = req.params;
    const objectoEncontrado = await ObjectoEncontradoService.updateObjectoEncontrado(id, req.body);
    if (!objectoEncontrado) {
      return respondError(req, res, 404, "No se encontró el objecto encontrado solicitado", "Not Found", { message: "Verifique el ID ingresado" });
    }
    respondSuccess(req, res, 200, objectoEncontrado);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> updateObjectoEncontrado");
    respondError(req, res, 500, "No se pudo actualizar el objecto encontrado");
  }
}

async function deleteObjectoEncontrado(req, res) {
  try {
    const { id } = req.params;
    const objectoEncontrado = await ObjectoEncontradoService.deleteObjectoEncontrado(id);
    objectoEncontrado === null
      ? respondError(
          req,
          res,
          404,
          "No se encontro el objecto encontrado solicitado",
          "Not Found",
          { message: "Verifique el id ingresado" },
        )
      : respondSuccess(req, res, 200, objectoEncontrado);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> deleteObjectoEncontrado");
    respondError(req, res, 500, "No se pudo eliminar el objecto encontrado");
  }
}

async function uploadObjectoEncontradoImage(req, res) {
  try {
    const { id } = req.params;
    const imageUrl = 'http://localhost:3001/' + req.file.path;

    // Actualizamos el objeto encontrado con la URL de la imagen
    const updatedObjectoEncontrado = await ObjectoEncontrado.findByIdAndUpdate(id, { imagen: imageUrl }, { new: true });

    return res.status(200).json({ success: true, message: 'Imagen subida exitosamente', objectoEncontrado: updatedObjectoEncontrado });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al subir la imagen', error: error.message });
  }
}

async function getObjectoEncontradosByUserId(req, res) {
  try {
      const { userId } = req.params;
      const objectoEncontrados = await ObjectoEncontradoService.getObjectoEncontradosByUserId(userId);
      objectoEncontrados.length === 0
          ? respondSuccess(req, res, 204)
          : respondSuccess(req, res, 200, objectoEncontrados);
  } catch (error) {
      respondError(req, res, 400, error.message);
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

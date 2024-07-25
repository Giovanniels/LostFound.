// backend/src/controllers/ObjectoEncontrado.controller.js
const { respondSuccess, respondError } = require("../utils/resHandler");
const ObjectoEncontradoService = require("../services/ObjectoEncontrado.service");
const { handleError } = require("../utils/errorHandler");
const ObjectoEncontrado = require("../models/ObjectoEncontrado.model");
const ValoracionService = require("../services/Valoracion.service");
const Tipo = require('../models/Tipo.model');
const ObjectId = require('mongoose').Types.ObjectId;

async function getObjectoEncontrados(req, res) {
  try {
    // Obtener todas las publicaciones
    const objectoEncontrados = await ObjectoEncontradoService.getObjectoEncontrados();

    // Filtrar y priorizar las publicaciones según su relevancia y fecha de publicación
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Dos semanas en milisegundos
    const prioritizedObjectoEncontrados = objectoEncontrados.filter(objetoEncontrado => objetoEncontrado.activa && objetoEncontrado.relevante && objetoEncontrado.fecha >= twoWeeksAgo);

    // Devolver la lista de publicaciones priorizadas
    respondSuccess(req, res, 200, prioritizedObjectoEncontrados);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> getObjectoEncontrados");
    respondError(req, res, 500, "No se pudo obtener los objetos encontrados");
  }
}

async function buscarObjectoEncontradoPorTipo(req, res) {
  try {
    let tipo = req.params.tipo;

    if (!ObjectId.isValid(tipo)) {
      const tipoExistente = await Tipo.findOne({ nombre: tipo });
      if (!tipoExistente) {
        return res.status(404).json({ success: false, message: 'El tipo de objeto especificado no existe.' });
      }
      tipo = tipoExistente._id;
    }

    const objetosEncontrados = await ObjectoEncontrado.find({ tipo })
      .populate('tipo');

    res.status(200).json({ success: true, objetosEncontrados });
  } catch (error) {
    console.error('Error al buscar objetos encontrados:', error);
    res.status(500).json({ success: false, message: 'Error al buscar objetos encontrados.' });
  }
}

async function createObjectoEncontrado(req, res) {
  try {
    const { userId, ...objectoEncontradoData } = req.body;

    // Verificar si se adjuntó una imagen
    const imageUrl = req.file ? 'http://146.83.198.35:1606' + req.file.path : null;

    // Agregar la URL de la imagen a los datos del objeto encontrado si existe
    if (imageUrl) {
      objectoEncontradoData.imagen = imageUrl;
    }

    // Agregar nuevoTipo al objeto encontrado si está presente en la solicitud
    if (req.body.nuevoTipo) {
      objectoEncontradoData.nuevoTipo = req.body.nuevoTipo;
    }

    // Verificar el promedio de valoración del usuario
    const promedioValoracion = await ValoracionService.obtenerPromedioValoraciones(userId);
    
    // Permitir la creación del objeto encontrado si el promedio de valoraciones es mayor o igual a 3, o si no tiene valoraciones (promedioValoracion === null)
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
    // Manejo específico para error de tipo similar
    if (error.message === 'El nuevo tipo es demasiado similar a uno existente.') {
      return respondError(req, res, 400, error.message);
    }

    handleError(error, "objectoEncontrado.controller -> createObjectoEncontrado");
    return respondError(req, res, 500, "No se pudo crear el objeto encontrado");
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
          "No se encontró el objeto encontrado solicitado",
          "Not Found",
          { message: "Verifique el id ingresado" },
        )
      : respondSuccess(req, res, 200, objectoEncontrado);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> getObjectoEncontradoById");
    respondError(req, res, 500, "No se pudo obtener el objeto encontrado");
  }
}

async function updateObjectoEncontrado(req, res) {
  try {
    const { id } = req.params;
    const objectoEncontrado = await ObjectoEncontradoService.updateObjectoEncontrado(id, req.body);
    if (!objectoEncontrado) {
      return respondError(req, res, 404, "No se encontró el objeto encontrado solicitado", "Not Found", { message: "Verifique el ID ingresado" });
    }
    respondSuccess(req, res, 200, objectoEncontrado);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> updateObjectoEncontrado");
    respondError(req, res, 500, "No se pudo actualizar el objeto encontrado");
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
          "No se encontró el objeto encontrado solicitado",
          "Not Found",
          { message: "Verifique el id ingresado" },
        )
      : respondSuccess(req, res, 200, objectoEncontrado);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> deleteObjectoEncontrado");
    respondError(req, res, 500, "No se pudo eliminar el objeto encontrado");
  }
}

async function uploadObjectoEncontradoImage(req, res) {
  try {
    const { id } = req.params;
    const imageUrl = 'http://146.83.198.35:1606' + req.file.path;

    // Actualizamos el objeto encontrado con la URL de la imagen
    const updatedObjectoEncontrado = await ObjectoEncontrado.findByIdAndUpdate(id, { imagen: imageUrl }, { new: true });

    return res.status(200).json({ success: true, message: 'Imagen subida exitosamente', objectoEncontrado: updatedObjectoEncontrado });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al subir la imagen', error: error.message });
  }
}

async function getObjectoEncontradosByUserId(req, res) {
  try {
    const { userId } = req.params; // Obtener el userId de los parámetros de la solicitud
    const objectoEncontrados = await ObjectoEncontradoService.getObjectoEncontradosByUserId(userId); // Llamar al servicio para buscar publicaciones de objetos encontrados por userId

    if (!objectoEncontrados || objectoEncontrados.length === 0) {
      // Si no se encontraron publicaciones, devolver una respuesta 200 con un mensaje informativo
      return respondSuccess(
        req,
        res,
        200,
        { message: "No se encontraron publicaciones de objetos encontrados para este usuario" }
      );
    }

    respondSuccess(req, res, 200, objectoEncontrados);
  } catch (error) {
    handleError(error, "objectoEncontrado.controller -> getObjectoEncontradosByUserId");
    respondError(req, res, 500, "No se pudo obtener las publicaciones de objetos encontrados");
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

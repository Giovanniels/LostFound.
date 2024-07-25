const { respondSuccess, respondError } = require("../utils/resHandler");
const ObjectoPerdidoService = require("../services/ObjectoPerdido.service");
const { handleError } = require("../utils/errorHandler");
const ObjectoPerdido = require("../models/ObjectoPerdido.model");//
const ValoracionService = require("../services/Valoracion.service")
const Tipo = require('../models/Tipo.model');
const ObjectId = require('mongoose').Types.ObjectId;

async function getObjectoPerdidos(req, res) {
  try {
    // Obtener todas las publicaciones
    const objectoPerdidos = await ObjectoPerdidoService.getObjectoPerdidos();

    // Filtrar y priorizar las publicaciones según su relevancia y fecha de publicación
    const currentDate = new Date();
    const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Dos semanas en milisegundos
    const prioritizedObjectoPerdidos = objectoPerdidos.filter(objetoPerdido => objetoPerdido.activa && objetoPerdido.relevante && objetoPerdido.fecha >= twoWeeksAgo);

    // Devolver la lista de publicaciones priorizadas
    respondSuccess(req, res, 200, prioritizedObjectoPerdidos);
  } catch (error) {
    handleError(error, "objectoPerdido.controller -> getObjectoPerdidos");
    respondError(req, res, 500, "No se pudo obtener los objetos perdidos");
  }
}

async function buscarObjectoPerdidoPorTipo(req, res) {
  try {
    let tipo = req.params.tipo;

    if (!ObjectId.isValid(tipo)) {
      const tipoExistente = await Tipo.findOne({ nombre: tipo });
      if (!tipoExistente) {
        return res.status(404).json({ success: false, message: 'El tipo de objeto especificado no existe.' });
      }
      tipo = tipoExistente._id;
    }

    const objetosPerdidos = await ObjectoPerdido.find({ tipo })
      .populate('tipo');

    res.status(200).json({ success: true, objetosPerdidos });
  } catch (error) {
    console.error('Error al buscar objetos perdidos:', error);
    res.status(500).json({ success: false, message: 'Error al buscar objetos perdidos.' });
  }
}

async function createObjectoPerdido(req, res) {
  try {
    const { userId, ...objectoPerdidoData } = req.body;

    // Verificar si se adjuntó una imagen
    const imageUrl = req.file ? 'http://localhost:3001/' + req.file.path : null;

    // Agregar la URL de la imagen a los datos del objeto perdido si existe
    if (imageUrl) {
      objectoPerdidoData.imagen = imageUrl;
    }

    // Agregar nuevoTipo al objeto perdido si está presente en la solicitud
    if (req.body.nuevoTipo) {
      objectoPerdidoData.nuevoTipo = req.body.nuevoTipo;
    }

    // Verificar el promedio de valoración del usuario
    const promedioValoracion = await ValoracionService.obtenerPromedioValoraciones(userId);
    
    // Permitir la creación del objeto perdido si el promedio de valoraciones es mayor o igual a 3, o si no tiene valoraciones (promedioValoracion === null)
    if (promedioValoracion >= 3 || promedioValoracion === 0) {
      const nuevoObjectoPerdido = await ObjectoPerdidoService.createObjectoPerdido(userId, objectoPerdidoData);
      
      if (!nuevoObjectoPerdido) {
        return respondError(
          req,
          res,
          400,
          "Error en la validación de datos",
          "Bad Request",
          { message: "Verifique los datos ingresados" }
        );
      }
      
      return respondSuccess(req, res, 201, nuevoObjectoPerdido);
    }

    // Restricción temporal activa debido a un bajo promedio de valoraciones
    return respondError(req, res, 403, "No puedes publicar debido a un bajo promedio de valoraciones");
    
  } catch (error) {
    // Manejo específico para error de tipo similar
    if (error.message === 'El nuevo tipo es demasiado similar a uno existente.') {
      return respondError(req, res, 400, error.message);
    }

    handleError(error, "objectoPerdido.controller -> createObjectoPerdido");
    return respondError(req, res, 500, "No se pudo crear el objeto perdido");
  }
}

async function getObjectoPerdidoById(req, res) {
  try {
    const { id } = req.params;

    const objectoPerdido = await ObjectoPerdidoService.getObjectoPerdidoById(id);
    objectoPerdido === null
      ? respondError(
          req,
          res,
          404,
          "No se encontro el objecto perdido solicitado",
          "Not Found",
          { message: "Verifique el id ingresado" },
        )
      : respondSuccess(req, res, 200, objectoPerdido);
  } catch (error) {
    handleError(error, "objectoPerdido.controller -> getObjectoPerdidoById");
    respondError(req, res, 500, "No se pudo obtener el objectoPerdido");
  }
}

async function updateObjectoPerdido(req, res) {
  try {
    const { id } = req.params;
    const objectoPerdido = await ObjectoPerdidoService.updateObjectoPerdido(id, req.body);
    if (!objectoPerdido) {
      return respondError(req, res, 404, "No se encontró el objecto perdido solicitado", "Not Found", { message: "Verifique el ID ingresado" });
    }
    respondSuccess(req, res, 200, objectoPerdido);
  } catch (error) {
    handleError(error, "objectoPerdido.controller -> updateObjectoPerdido");
    respondError(req, res, 500, "No se pudo actualizar el objectoPerdido");
  }
}

async function deleteObjectoPerdido(req, res) {
  try {
    const { id } = req.params;
    const objectoPerdido = await ObjectoPerdidoService.deleteObjectoPerdido(id);
    objectoPerdido === null
      ? respondError(
          req,
          res,
          404,
          "No se encontro el objecto perdido solicitado",
          "Not Found",
          { message: "Verifique el id ingresado" },
        )
      : respondSuccess(req, res, 200, objectoPerdido);
  } catch (error) {
    handleError(error, "objectoPerdido.controller -> deleteObjectoPerdido");
    respondError(req, res, 500, "No se pudo eliminar el objecto perdido");
  }
}

async function uploadObjectoPerdidoImage(req, res) {
  try {
    const { id } = req.params;
    const imageUrl = 'http://localhost:3001/' + req.file.path;

    // Actualizamos el objeto perdido con la URL de la imagen
    const updatedObjectoPerdido = await ObjectoPerdido.findByIdAndUpdate(id, { imagen: imageUrl }, { new: true });

    return res.status(200).json({ success: true, message: 'Imagen subida exitosamente', objectoPerdido: updatedObjectoPerdido });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al subir la imagen', error: error.message });
  }
}

async function getObjectoPerdidosByUserId(req, res) {
  try {
    const { userId } = req.params; // Obtener el userId de los parámetros de la solicitud
    const objectoPerdidos = await ObjectoPerdidoService.getObjectoPerdidosByUserId(userId); // Llamar al servicio para buscar publicaciones de objetos perdidos por userId

    if (!objectoPerdidos || objectoPerdidos.length === 0) {
      // Si no se encontraron publicaciones, devolver una respuesta 200 con un mensaje informativo
      return respondSuccess(
        req,
        res,
        200,
        { message: "No se encontraron publicaciones de objetos perdidos para este usuario" }
      );
    }

    respondSuccess(req, res, 200, objectoPerdidos);
  } catch (error) {
    handleError(error, "objectoPerdido.controller -> getObjectoPerdidosByUserId");
    respondError(req, res, 500, "No se pudo obtener las publicaciones de objetos perdidos");
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

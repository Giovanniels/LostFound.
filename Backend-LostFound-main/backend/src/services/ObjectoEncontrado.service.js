const ObjectoEncontrado = require("../models/ObjectoEncontrado.model");
const { handleError } = require("../utils/errorHandler");
const { objectoEncontradoBodySchema } = require("../schema/ObjectoEncontrado.schema");
const Tipo = require('../models/Tipo.model');

async function getObjectoEncontrados() {
    try {
        const currentDate = new Date();
        const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000); // Dos semanas en milisegundos

        // Obtener los objetos encontrados dentro del período de dos semanas
        const objectoEncontrados = await ObjectoEncontrado.find({ fecha: { $gte: twoWeeksAgo } }).populate("tipo");

        // Actualizar el estado de relevancia de los objetos encontrados que han caducado
        objectoEncontrados.forEach(async objetoEncontrado => {
            if (currentDate - objetoEncontrado.fecha > 14 * 24 * 60 * 60 * 1000) {
                objetoEncontrado.relevante = false;
                await objetoEncontrado.save();
            }
        });

        // Filtrar y priorizar los objetos encontrados según su relevancia
        const prioritizedObjectoEncontrados = objectoEncontrados.filter(objetoEncontrado => objetoEncontrado.activa && objetoEncontrado.relevante);

        return prioritizedObjectoEncontrados;
    } catch (error) {
        handleError(error, "ObjectoEncontrado.service -> getObjectoEncontrados");
    }
}

async function buscarObjectoEncontradoPorTipo(req, res) {
    try {
      const tipo = req.query.tipo; // Obtener el tipo de objeto a buscar desde la consulta
  
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
  

async function createObjectoEncontrado(userId, objectoEncontradoData) {
    try {
        const { error } = objectoEncontradoBodySchema.validate(objectoEncontradoData);
        if (error) return null;
        
        const { fecha, tipo, descripcion, detalles, ubicacion, informacionContacto } = objectoEncontradoData;
        
        // Creamos un nuevo objeto encontrado asociado al usuario
        const newObjectoEncontrado = new ObjectoEncontrado({ 
            fecha, 
            tipo, 
            descripcion, 
            detalles, 
            ubicacion, 
            informacionContacto, 
            usuario: userId // Asociamos el ID del usuario al objeto encontrado
        });

        return await newObjectoEncontrado.save();
    } catch (error) {
        handleError(error, "ObjectoEncontrado.service -> createObjectoEncontrado");
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
        throw new Error("No se pudo actualizar el objeto Encontrado");
    }
}

async function deleteObjectoEncontrado(id) {
    try {
        return await ObjectoEncontrado.findByIdAndDelete(id);
    } catch (error) {
        handleError(error, "objectoEncontrado.service -> deleteObjectoEncontrado");
    }
}

async function uploadObjectoEncontradoImage(id, imageUrl) {
    try {
        // Actualizamos el objeto encontrado con la URL de la imagen
        const updatedObjectoEncontrado = await ObjectoEncontrado.findByIdAndUpdate(id, { imagen: imageUrl }, { new: true });

        return updatedObjectoEncontrado;
    } catch (error) {
        throw new Error("Error al subir la imagen");
    }
}

async function getObjectoEncontradosByUserId(userId) {
    try {
        return await ObjectoEncontrado.find({ usuario: userId });
    } catch (error) {
        handleError(error, "ObjectoEncontrado.service -> getObjectoEncontradosByUserId");
    }
}

async function getObjectoEncontradoById(id) {
    try {
        return await ObjectoEncontrado.findById(id);
    } catch (error) {
        handleError(error, "ObjectoEncontrado.service -> getObjectoEncontradoById");
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

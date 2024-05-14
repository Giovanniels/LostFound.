const Tipo = require("../models/Tipo.model");
const { handleError } = require("../utils/errorHandler");
const { TipoBodySchema } = require("../schema/Tipo.schema");
const natural = require('natural');

async function getTipo() {
    try {
        return await Tipo.find();
    } catch (error) {
        handleError(error, "Tipo.service -> getTipo");
    }
}

async function createTipo(tipo) {
    try {
      const { error } = TipoBodySchema.validate(tipo);
      if (error) return null;
  
      const { nombre } = tipo;
  
      // Verificar si el nuevo tipo es demasiado similar a uno existente
      const tiposExistentes = await Tipo.find();
      const nuevoNombre = nombre.toLowerCase();
      const tokenizer = new natural.WordTokenizer();
      const umbral = 0.8; // Umbral mínimo de similitud
  
      for (const tipoExistente of tiposExistentes) {
        const nombreExistente = tipoExistente.nombre.toLowerCase();
        const tokensNuevo = tokenizer.tokenize(nuevoNombre);
        const tokensExistente = tokenizer.tokenize(nombreExistente);
        const similitud = natural.JaroWinklerDistance(tokensNuevo.join(' '), tokensExistente.join(' '));
  
        if (similitud > umbral) {
          return null;
        }
      }
  
      const newTipo = new Tipo({ nombre });
      return await newTipo.save();
    } catch (error) {
      handleError(error, "Tipo.service -> createTipo");
    }
  }

async function getTipoById(id) {
    try {
        return await Tipo.findById({ _id: id });
    } catch (error) {
        handleError(error, "Tipo.service -> getTipoById");
    }
}


async function updateTipo(id, Tipo) {
    try {
        const { error } = TipoBodySchema.validate(Tipo);
        if (error) return null;

        return await Tipo.findByIdAndUpdate(id, Tipo);
    } catch (error) {
        handleError(error, "Tipo.service -> updateTipo");
    }
}

async function deleteTipo(id) {
    try {
        return await Tipo.findByIdAndDelete(id);
    } catch (error) {
        handleError(error, "Tipo.service -> deleteTipo");
    }
}

module.exports = {
    getTipo,
    createTipo,
    getTipoById,
    updateTipo,
    deleteTipo,
};

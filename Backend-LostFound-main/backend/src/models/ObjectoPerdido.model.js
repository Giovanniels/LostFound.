const mongoose = require("mongoose");

const objectoPerdidoSchema = new mongoose.Schema({
  imagen: {
    type: String, // Puedes almacenar la URL de la imagen
  },
  
  fecha: {
    type: Date,
    default: Date.now,
  },

  activa: {
    type: Boolean,
    default: true,
  },
  relevante: {
    type: Boolean,
    default: true,
  },

  tipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tipo",
  },
// frontend
  nuevoTipo: {
    type: String, // Campo para almacenar el nuevo tipo creado desde el frontend
  },


  descripcion: {
    type: String,
  },

  detalles: {
    type: String,
  },

  ubicacion: {
    type: String,
  },

  informacionContacto: {
    type: String,
  },

  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario", // Este debe ser el nombre del modelo de usuario
  }
});

const ObjectoPerdido = mongoose.model("ObjectoPerdido", objectoPerdidoSchema);

module.exports = ObjectoPerdido;

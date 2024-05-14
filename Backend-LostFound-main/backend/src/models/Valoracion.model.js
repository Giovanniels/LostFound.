const mongoose = require("mongoose");

const valoracionSchema = new mongoose.Schema({
    usuarioValorado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    usuarioQueValora: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    puntaje: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comentario: {
        type: String,
        required: false,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

const Valoracion = mongoose.model("Valoracion", valoracionSchema);

module.exports = Valoracion;

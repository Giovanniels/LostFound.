const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contrasenaTemporal: {
        type: String,
        required: false, // Cambiado a false para que no sea requerido
    },
    contraseñaCambiada: {
        type: Boolean,
        default: false,
    },
    rol:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rol",
    },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;

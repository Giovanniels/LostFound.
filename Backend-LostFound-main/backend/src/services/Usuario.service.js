const Usuario = require("../models/Usuario.model");
const { handleError } = require("../utils/errorHandler");
const { usuarioBodySchema } = require("../schema/Usuario.schema");
const bcrypt = require("bcrypt");// guardar contraseña


async function getUsuarios() {
    try {
        return await Usuario.find();
    } catch (error) {
        handleError(error, "Usuario.service -> getUsuarios");
    }
}


async function createUsuario(usuario) {
    try {
        const { nombre, email, contrasenaTemporal } = usuario;

        const usuarioFound = await Usuario.findOne({ email: usuario.email });
        if (usuarioFound) return null;

        // Cifra la contraseña temporal antes de guardarla en la base de datos
        const hashContrasenaTemporal = await bcrypt.hash(contrasenaTemporal, 10);

        const newUsuario = new Usuario({ nombre, email, contrasenaTemporal: hashContrasenaTemporal });
        return await newUsuario.save();
    } catch (error) {
        handleError(error, "Usuario.service -> createUsuario");
    }
}

async function getUsuarioById(id) {
    try {
        return await Usuario.findById({ _id: id });
    } catch (error) {
        handleError(error, "Usuario.service -> getUsuarioById");
    }
}

async function updateUsuario(id, usuario) {
    try {
        return await Usuario.findByIdAndUpdate(id, usuario);
    } catch (error) {
        handleError(error, "Usuario.service -> updateUsuario");
    }
}

async function deleteUsuario(id) {
    try {
        return await Usuario.findByIdAndDelete(id);
    } catch (error) {
        handleError(error, "Usuario.service -> deleteUsuario");
    }
}

async function getUsuarioByEmail(email) {
    try {
        return await Usuario.findOne({ email: email }).select('+contraseña');
    } catch (error) {
        handleError(error, "Usuario.service -> getUsuarioByEmail");
    }
}

module.exports = {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,

    getUsuarioByEmail,
};

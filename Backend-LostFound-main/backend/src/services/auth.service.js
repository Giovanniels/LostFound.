// Servicio creado para manejar la autenticación de usuarios
const Usuario = require("../models/Usuario.model");

const jwt = require("jsonwebtoken");
const { configEnv } = require("../config/configEnv.js");
const { handleError } = require("../utils/errorHandler");

const { JWT_SECRET } = configEnv();


async function signIn(usuario) {
  try {
    const usuarioFound = await Usuario.findOne({ email: usuario.email }).populate(
      "rol",
    );
    if (!usuarioFound) return null;

    return jwt.sign({ id: usuarioFound._id }, JWT_SECRET, {
      expiresIn: 86400, // 24 horas
    });
  } catch (error) {
    handleError(error, "auth.service -> signIn");
  }
}

module.exports = {
  signIn,
};

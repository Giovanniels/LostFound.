// Autenticacion - Confirmamos si el usuario nos envia el token
const jwt = require("jsonwebtoken");
const { configEnv } = require("../config/configEnv.js");
const { handleError } = require("../utils/errorHandler");

const { JWT_SECRET } = configEnv();
const Usuario = require("../models/Usuario.model.js");
const { respondError } = require("../utils/resHandler");


const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) return respondError(req, res, 403, "No hay token");

    const decoded = jwt.verify(token, JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return respondError(req, res, 404, "Hay token pero no hay usuario");
    }

    // Agregar el userId al objeto de solicitud para que esté disponible en el controlador
    req.userId = decoded.id;

    next();
  } catch (error) {
    handleError(error, "authe.middleware -> verifyToken");
  }
};


module.exports = {
  verifyToken,
};

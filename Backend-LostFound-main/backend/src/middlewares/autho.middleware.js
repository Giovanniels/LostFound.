// Autorizacion - Comprobar el rol del usuario
const Rol = require("../models/Rol.model");
const Usuario = require("../models/Usuario.model");
const { respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");
// se relaciona el rol y el usuario
async function isPorteriaUBB(req, res, next) {
  try {
    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario) {
      return respondError(req, res, 401, "Usuario Porteria UBB no encontrado!");
    }

    const rol = await Rol.find({ _id: { $in: usuario.rol } });
    for (let i = 0; i < rol.length; i++) {
      if (rol[i].nombre === "Administrador") {
        next();
        return;
      }
    }
    return respondError(req, res, 401, "Require Usuario Porteria UBB Rol!");
  } catch (error) {
    handleError(error, "autho.middleware -> isAdministrador");
  }
}

module.exports = {
  isPorteriaUBB,
};

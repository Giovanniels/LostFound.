const express = require("express");
const usuarioController = require("../controllers/Usuario.controller");
const authoMiddleware = require("../middlewares/autho.middleware.js");

const api = express.Router();

api.get("/", usuarioController.getUsuarios);
api.post("/", usuarioController.createUsuario);
api.get("/:id", usuarioController.getUsuarioById);
api.put("/:id", usuarioController.updateUsuario);
api.delete("/:id", usuarioController.deleteUsuario);

api.post("/login", usuarioController.loginUsuario); // frontend



module.exports = api;

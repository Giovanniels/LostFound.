const express = require("express");

const usuarioRoutes = require("./Usuario.routes");
const tipoRoutes = require("./Tipo.routes");
const authRoutes = require("./auth.routes.js");
const authMiddleware = require("../middlewares/authe.middleware.js");
const objectoPerdido = require("./ObjectoPerdido.routes");
const objectoEncontrado = require("./ObjectoEncontrado.routes");
const valoracionRoutes = require("./Valoracion.routes");

const router = express.Router();

// authMiddleware.verifyToken
router.use("/Usuario", usuarioRoutes);
router.use("/auth", authRoutes);
router.use("/Tipo", tipoRoutes);
router.use("/ObjectoPerdido", objectoPerdido);
router.use("/ObjectoEncontrado", objectoEncontrado);
router.use("/Valoracion", valoracionRoutes);

module.exports = router;

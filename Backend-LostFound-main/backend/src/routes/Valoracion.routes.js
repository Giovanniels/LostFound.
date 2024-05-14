// Valoracion.routes.js
const express = require("express");
const router = express.Router();
const valoracionController = require("../controllers/Valoracion.controller");

// Ruta para dejar una valoración a un usuario
router.post("/rate", valoracionController.crearValoracion);

// Ruta para obtener todas las valoraciones de un usuario por su ID
router.get("/:usuarioId", valoracionController.obtenerValoracionesPorUsuario);

// Ruta para obtener el promedio de las valoraciones de un usuario por su ID
router.get("/promedio/:usuarioId", valoracionController.obtenerPromedioValoraciones);

module.exports = router;

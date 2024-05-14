const express = require("express");
const TipoController = require("../controllers/Tipo.controller");
const authoMiddleware = require("../middlewares/autho.middleware.js");
const router = express.Router();

router.get("/", TipoController.getTipo);
router.post("/", TipoController.createTipo);
router.get("/:id", TipoController.getTipoById);
router.put("/:id", TipoController.updateTipo);
router.delete("/:id", TipoController.deleteTipo);

module.exports = router;

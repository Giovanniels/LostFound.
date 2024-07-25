const express = require("express");
const multer = require("multer");
const objectoEncontradoController = require("../controllers/ObjectoEncontrado.controller.js");
const authoMiddleware = require("../middlewares/autho.middleware.js");
const router = express.Router();
const path = require("path"); // Importa la librería path

// Configurar el almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// Función de validación de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error('Formato de archivo no válido. Solo se permiten archivos JPEG y PNG.'), false); // Rechazar el archivo
  }
};

// Definir el tamaño máximo del archivo en bytes
const maxSize = 5 * 1024 * 1024; // 5 MB (ajusta el tamaño según lo necesites)

// Crear un middleware de multer con configuración y validación de archivos
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
});

// Middleware para registrar información de la imagen antes de guardarla
const logImageInfo = (req, res, next) => {
  // Puedes registrar información relevante aquí si es necesario
  next();
};

router.get("/", objectoEncontradoController.getObjectoEncontrados);
router.post("/", upload.single('imagen'), logImageInfo, objectoEncontradoController.createObjectoEncontrado);
router.get("/:id", objectoEncontradoController.getObjectoEncontradoById);
router.put("/:id", objectoEncontradoController.updateObjectoEncontrado);
router.delete("/:id", objectoEncontradoController.deleteObjectoEncontrado);
router.get("/user/:userId", objectoEncontradoController.getObjectoEncontradosByUserId);
router.get("/buscar/:tipo", objectoEncontradoController.buscarObjectoEncontradoPorTipo);

module.exports = router;

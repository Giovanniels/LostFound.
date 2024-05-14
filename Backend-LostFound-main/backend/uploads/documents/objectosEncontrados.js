const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configurar multer para cargar imágenes de objetos encontrados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/objectosEncontrados'); // Cambiar la carpeta de destino
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para manejar la carga de imágenes de objetos encontrados
router.post('/upload/encontrados', upload.single('imagen'), (req, res) => {
  // Lógica para guardar la imagen de objeto encontrado en la base de datos y responder con la URL de la imagen guardada
});

// Otras rutas para mostrar, actualizar y eliminar imágenes de objetos encontrados...

module.exports = router;

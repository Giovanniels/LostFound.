const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configurar el almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Función de validación de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error('Formato de archivo no válido. Solo se permiten archivos JPEG y PNG.'), false); // Rechazar el archivo
  }
};

// Función de validación del tamaño máximo de archivo (en bytes)
const maxSize = 5 * 1024 * 1024; // 5 MB (ajusta el tamaño según lo necesites)

// Crear un middleware de multer con configuración y validación de archivos
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize }
});

// Ruta para manejar la carga de imágenes general
router.post('/upload/general', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
  }
  
  // Si se proporcionó una imagen, devuelve la ruta de la imagen guardada
  res.json({ imageUrl: 'http://146.83.198.35:1606' + req.file.path });
});

module.exports = router;

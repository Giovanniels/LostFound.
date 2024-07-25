const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const { configEnv } = require("./config/configEnv.js");
const { setupDB } = require("./config/configDB.js");
const { handleFatalError, handleError } = require("./utils/errorHandler.js");
const { createRoles, verRoles, showUsers, createUsers, deleteAllUsers, eliminarRoles } = require("./config/initialSetup");

const indexRoutes = require("./routes/index.routes.js");

async function setupServer() {
  try {
    const { PORT, HOST } = configEnv();
    const server = express();

    // Configurar CORS
    const corsOptions = {
      origin: "http://146.83.198.35:443", // Reemplaza con la URL real del cliente
      methods: "GET, POST, PUT, DELETE",
      allowedHeaders: "Content-Type, Authorization",
    };
    server.use(cors(corsOptions));

    server.use(express.json());
    server.use(morgan("dev"));
    server.use(express.urlencoded({ extended: false }));

    // Configurar multer para manejar la carga de archivos
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/') // Directorio donde se guardarán las imágenes
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    });
    const upload = multer({ storage: storage });

    // Ruta para manejar la carga de imágenes
    server.post('/upload', upload.single('imagen'), (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
      }
      res.json({ imageUrl: 'http://146.83.198.35:1606' + req.file.path });
    });

    // Configurar Express para servir archivos estáticos
    server.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    // Rutas principales
    server.use("/api", indexRoutes);

    server.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (err) {
    handleError(err, "/server.js -> setupServer");
  }
}

async function setupAPI() {
  try {
    await setupDB();
    await setupServer();
    //await eliminarRoles();
    await createRoles();
    await verRoles();
    //await deleteAllUsers();
    await createUsers();
    await showUsers();
    //await createMedicamentos();
  } catch (err) {
    handleFatalError(err, "/server.js -> setupAPI");
  }
}

// Inicia la API
setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((err) => handleFatalError(err, "/server.js -> setupAPI"));

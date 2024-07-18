const { respondSuccess, respondError } = require("../utils/resHandler");
const UsuarioService = require("../services/Usuario.service");
const { handleError } = require("../utils/errorHandler");
const { generarContraseñaAleatoria, enviarCorreoElectronico } = require("../utils/emailHandler");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


async function getUsuarios(req, res) {
    try {
        const usuarios = await UsuarioService.getUsuarios();
        usuarios.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, usuarios);
    } catch (error) {
        respondError(req, res, 400, error.message);
    }
}
async function createUsuario(req, res) {
    try {
        const { nombre, email } = req.body;

        // Verifica si el correo electrónico es válido
        if (!/^[^\s@]+@(alumnos\.ubiobio\.cl|gmail\.com)$/.test(email)) {
            return respondError(
                req,
                res,
                400,
                "El correo electrónico debe pertenecer al dominio @alumnos.ubiobio.cl o @gmail.com",
                "Bad Request",
                { message: "Por favor, ingrese una dirección de correo electrónico válida." }
            );
        }

        // Genera una contraseña aleatoria para el usuario
        const contraseñaAleatoria = generarContraseñaAleatoria();

        // Crea el nuevo usuario con la contraseña aleatoria
        const nuevoUsuario = await UsuarioService.createUsuario({ nombre, email, contrasenaTemporal: contraseñaAleatoria });

        // Verifica si se pudo crear el usuario
        if (!nuevoUsuario) {
            return respondError(
                req,
                res,
                400,
                "Error en la validación de datos",
                "Bad Request",
                { message: "Verifique los datos ingresados" }
            );
        }

        // Envía un correo electrónico al usuario con la contraseña temporal
        await enviarCorreoElectronico(email, "Bienvenido a nuestro sitio", `Tu contraseña temporal es: ${contraseñaAleatoria}`);

        respondSuccess(req, res, 201, nuevoUsuario);
    } catch (error) {
        handleError(error, "Usuario.controller -> createUsuario");
        respondError(req, res, 500, "No se pudo crear el usuario");
    }
}

async function getUsuarioById(req, res) {
    try {
        const { id } = req.params;
        const usuario = await UsuarioService.getUsuarioById(id);
        usuario === null
        ? respondError(
            req,
            res,
            404,
            "No se encontro el usuario solicitado",
            "Not Found",
            { message: "Verifique el id ingresado" },
        )
        : respondSuccess(req, res, 200, usuario);
    } catch (error) {
        handleError(error, "Usuario.controller -> getUsuarioById");
        respondError(req, res, 500, "No se pudo obtener el usuario");
    }
}

async function updateUsuario(req, res) {
    try {
        const { id } = req.params;
        const { nuevaContraseña, ...userData } = req.body; // Extraer nuevaContraseña del body
        const usuario = await UsuarioService.updateUsuario(id, userData, nuevaContraseña); // Pasar nuevaContraseña al servicio
        usuario === null
        ? respondError(
            req,
            res,
            404,
            "No se encontro el usuario solicitado",
            "Not Found",
            { message: "Verifique el id ingresado" },
        )
        : respondSuccess(req, res, 200, usuario);
    } catch (error) {
        handleError(error, "Usuario.controller -> updateUsuario");
        respondError(req, res, 500, "No se pudo actualizar el usuario");
    }
}




async function deleteUsuario(req, res) {
    try {
        const { id } = req.params;
        const usuario = await UsuarioService.deleteUsuario(id);
        usuario === null
        ? respondError(
            req,
            res,
            404,
            "No se encontro el usuario solicitado",
            "Not Found",
            { message: "Verifique el id ingresado" },
        )
        : respondSuccess(req, res, 200, usuario);
    } catch (error) {
        handleError(error, "Usuario.controller -> deleteUsuario");
        respondError(req, res, 500, "No se pudo eliminar el usuario");
    }
}
async function loginUsuario(req, res) {
    try {
        const { email, contrasenaTemporal } = req.body;

        // Buscar al usuario por su correo electrónico
        const usuario = await UsuarioService.getUsuarioByEmail(email);

        if (!usuario) {
            return respondError(req, res, 404, "Usuario no encontrado", "Not Found");
        }

        // Verificar la contraseña temporal
        const contraseñaValida = await bcrypt.compare(contrasenaTemporal, usuario.contrasenaTemporal);

        if (!contraseñaValida) {
            return respondError(req, res, 401, "Contraseña incorrecta", "Unauthorized");
        }

        // Generar token de acceso
        const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Devolver el token al cliente
        respondSuccess(req, res, 200, { token });
    } catch (error) {
        handleError(error, "Usuario.controller -> loginUsuario");
        respondError(req, res, 500, "Error al iniciar sesión");
    }
}


module.exports = {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,

    loginUsuario,
};

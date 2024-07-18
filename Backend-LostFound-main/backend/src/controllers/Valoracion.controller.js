const Valoracion = require("../models/Valoracion.model.js");
const Usuario = require("../models/Usuario.model.js");
const { handleError } = require("../utils/errorHandler");
const ValoracionService = require("../services/Valoracion.service");


async function crearValoracion(req, res) {
    try {
        const { usuarioValorado, usuarioQueValora, puntaje, comentario } = req.body;

        const usuarioValoradoExists = await Usuario.findById(usuarioValorado);
        if (!usuarioValoradoExists) {
            return res.status(404).json({ success: false, message: "El usuario que está siendo valorado no existe" });
        }

        // Verifica que el usuario que valora no sea el mismo que el valorado
        if (usuarioValorado === usuarioQueValora) {
            return res.status(400).json({ success: false, message: "No puedes valorarte a ti mismo" });
        }

        const nuevaValoracion = new Valoracion({
            usuarioValorado,
            puntaje,
            comentario,
            usuarioQueValora
        });

        await nuevaValoracion.save();

        res.status(201).json({ success: true, message: 'Valoración creada correctamente' });
    } catch (error) {
        console.error("Error al crear la valoración:", error);
        res.status(500).json({ success: false, message: "Error al crear la valoración" });
    }
}

async function obtenerTodasLasValoraciones(req, res) {
    try {
        const valoraciones = await Valoracion.find();
        res.status(200).json({ success: true, valoraciones });
    } catch (error) {
        console.error("Error al obtener las valoraciones:", error);
        res.status(500).json({ success: false, message: "Error al obtener las valoraciones" });
    }
}

async function obtenerValoracionesPorUsuario(req, res) {
    try {
        const { usuarioId } = req.params;
        const valoraciones = await Valoracion.find({ usuarioValorado: usuarioId })
            .populate('usuarioQueValora', 'nombre'); // Solo recuperamos el nombre del usuarioQueValora
        res.status(200).json({ success: true, valoraciones });
    } catch (error) {
        console.error("Error al obtener las valoraciones del usuario:", error);
        res.status(500).json({ success: false, message: "Error al obtener las valoraciones del usuario" });
    }
}



async function obtenerPromedioValoraciones(req, res) {
    try {
        const { usuarioId } = req.params;
        const promedio = await ValoracionService.obtenerPromedioValoraciones(usuarioId); // Llama a la función del servicio
        res.status(200).json({ success: true, promedio });
    } catch (error) {
        console.error("Error al obtener el promedio de las valoraciones:", error);
        res.status(500).json({ success: false, message: "Error al obtener el promedio de las valoraciones" });
    }
}

module.exports = {
    crearValoracion,
    obtenerTodasLasValoraciones,
    obtenerValoracionesPorUsuario,
    obtenerPromedioValoraciones,
};

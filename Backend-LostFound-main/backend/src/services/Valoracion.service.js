const Valoracion = require("../models/Valoracion.model");
const { handleError } = require("../utils/errorHandler");


async function crearValoracion(valoracionData) {
    try {
        const nuevaValoracion = new Valoracion(valoracionData);
        return await nuevaValoracion.save();
    } catch (error) {
        handleError(error, "Valoracion.service -> crearValoracion");
        throw new Error("No se pudo crear la valoración");
    }
}

async function obtenerValoracionesPorUsuario(usuarioId) {
    try {
        return await Valoracion.find({ usuarioValorado: usuarioId }).populate("usuarioValorador");
    } catch (error) {
        handleError(error, "Valoracion.service -> obtenerValoracionesPorUsuario");
        throw new Error("No se pudieron obtener las valoraciones del usuario");
    }
}

async function obtenerPromedioValoraciones(usuarioId) {
    try {
        const valoraciones = await Valoracion.find({ usuarioValorado: usuarioId });
        if (valoraciones.length === 0) {
            return 0;
        }
        const total = valoraciones.reduce((acc, val) => acc + val.puntaje, 0); // Suma los puntajes de las valoraciones
        return total / valoraciones.length; // Calcula el promedio dividiendo por la cantidad de valoraciones
    } catch (error) {
        console.error("Error al obtener el promedio de las valoraciones:", error);
        throw new Error("No se pudo calcular el promedio de las valoraciones");
    }
}



async function obtenerTodasLasValoraciones() {
    try {
        return await Valoracion.find();
    } catch (error) {
        handleError(error, "Valoracion.service -> obtenerTodasLasValoraciones");
        throw new Error("No se pudieron obtener todas las valoraciones");
    }
}

module.exports = {
    crearValoracion,
    obtenerValoracionesPorUsuario,
    obtenerPromedioValoraciones,
    obtenerTodasLasValoraciones, // Agregamos la nueva función
};

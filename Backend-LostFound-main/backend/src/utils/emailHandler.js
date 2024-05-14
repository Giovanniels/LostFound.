const nodemailer = require("nodemailer");

// Función para generar una contraseña aleatoria
function generarContraseñaAleatoria() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let contraseña = "";
    for (let i = 0; i < 8; i++) {
        contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contraseña;
}

// Función para enviar un correo electrónico
async function enviarCorreoElectronico(destinatario, asunto, mensaje) {
    try {
        // Configura el transporte SMTP
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'envionotificaciones869@gmail.com', // Cambia por tu dirección de correo electrónico
                pass: 'fbgp lzky ecuv llza', // Cambia por tu contraseña de correo electrónico
            },
        });

        // Configura el mensaje de correo electrónico
        let correo = {
            from: 'envionotificaciones869@gmail.com', // Cambia por tu dirección de correo electrónico
            to: destinatario,
            subject: asunto,
            text: mensaje,
        };

        // Genera una contraseña aleatoria
        const contraseñaAleatoria = generarContraseñaAleatoria();

        // Envía el correo electrónico
        await transporter.sendMail(correo);

        // Retorna la contraseña aleatoria para que pueda ser utilizada en otro lugar si es necesario
        return contraseñaAleatoria;
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
        throw new Error("No se pudo enviar el correo electrónico");
    }
}

module.exports = {
    enviarCorreoElectronico,
    generarContraseñaAleatoria,
};

const Rol = require("../models/Rol.model.js");
const Usuario = require("../models/Usuario.model.js");
// const Medicamento = require("../models/Medicamento.model.js");


async function eliminarRoles() {
  try {
    await Rol.deleteMany({});
    console.log("Roles eliminados exitosamente");
  } catch (error) {
    console.error(error);
  }
}


async function createRoles() {
  try {
    const count = await Rol.estimatedDocumentCount();
    if (count > 0) return;

    await Promise.all([
      new Rol({ nombre: "Administrador" }).save(),
      new Rol({ nombre: "Usuario" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

async function verRoles() {
  try {
    const roles = await Rol.find();
    console.log(roles);
  } catch (error) {
    console.error(error);
  }
}
async function deleteAllUsers() {
  try {
    await Usuario.deleteMany();
    console.log("Todos los usuarios han sido eliminados exitosamente.");
  } catch (error) {
    console.error(error);
  }
}

async function createUsers() {
  try {
    const count = await Usuario.estimatedDocumentCount();
    if (count > 0) return;

    const porteriaubb = await Rol.findOne({ nombre: "Administrador" });

    console.log("ID del rol Administrador:", porteriaubb._id);

    await Promise.all([
      new Usuario({
        nombre: "Portería UBB",
        email: "porteria@ubiobio.cl",
        rol: porteriaubb._id,
        contrasenaTemporal: "PorteriaUBB2401", // No incluir contraseña temporal para el administrador
      }).save(),
    ]);
    console.log("* => Usuario creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}


async function showUsers() {
  try {
    const usuarios = await Usuario.find().populate("rol");
    usuarios.forEach(usuario => {
      if (usuario) { // Verifica si el usuario existe antes de acceder a sus propiedades
 
        console.log(`rol: ${usuario.rol ? usuario.rol.nombre : 'Rol no especificado'}`); // Verifica si el rol existe antes de acceder a su propiedad 'nombre'
        console.log(`contraseña: ${usuario.contraseña}`);
        console.log();
      }
    });
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  createRoles,
  createUsers,
  verRoles,
  eliminarRoles,
  showUsers,
  deleteAllUsers,
};


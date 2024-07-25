"use strict";
// Importa el módulo 'mysql2' para crear la conexión a la base de datos
const mysql = require("mysql2");

// Agregamos la configuración de las variables de entorno
const { configEnv } = require("./configEnv.js");
const { handleError } = require("../utils/errorHandler");

// Obtiene las variables de entorno
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = configEnv();

// Crea la conexión a la base de datos
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

/**
 * @name setupDB
 * @description Función que crea la conexión a la base de datos
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function setupDB() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        handleError(err, "/configDB.js -> setupDB");
        reject(err);
      } else {
        console.log("=> Conectado a la base de datos MySQL");
        resolve();
      }
    });
  });
}

module.exports = { setupDB, connection };

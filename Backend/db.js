const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "soporte25",
  database: "libreria_db"
});

conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar a MySQL:", error);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

module.exports = conexion;

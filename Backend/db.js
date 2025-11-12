const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',    
  user: 'root',           
  password: 'Brigitte_lo',           
  database: 'libreria_db'    
});

conexion.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = conexion;

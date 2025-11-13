// ================================
// 💾 CONEXIÓN A BASE DE DATOS MySQL
// ================================
const mysql = require('mysql2');

// ✅ Crear conexión con manejo automático de reconexión
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Admin123',
  database: 'libreria_db',
  port: 3306,
  multipleStatements: true, // permite ejecutar varias consultas
});

// ✅ Intentar conectar
conexion.connect((error) => {
  if (error) {
    console.error('❌ Error al conectar con MySQL:', error.code, error.sqlMessage);
    return;
  }
  console.log('✅ Conectado correctamente a la base de datos libreria_db');
});

// ✅ Mantener conexión activa (evita timeout)
conexion.on('error', (err) => {
  console.error('⚠️ Error en la conexión MySQL:', err.code);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Intentando reconectar a la base de datos...');
    setTimeout(() => {
      conexion.connect();
    }, 2000);
  } else {
    throw err;
  }
});

module.exports = conexion;

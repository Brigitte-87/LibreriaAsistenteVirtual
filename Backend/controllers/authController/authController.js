const conexion = require("../../db");

module.exports = function login(req, res) {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.json({ ok: false, mensaje: "Faltan credenciales" });
  }

  const sql = `
    SELECT 
      usuario_id, 
      usuario, 
      nombre, 
      sucursal_id, 
      rol,
      activo
    FROM usuarios 
    WHERE usuario = ? AND password = ?
  `;

  conexion.query(sql, [usuario, password], (err, results) => {
    if (err) {
      console.error("Error al consultar usuario:", err);
      return res.json({ ok: false, mensaje: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.json({ ok: false, mensaje: "Credenciales incorrectas" });
    }

    const user = results[0];

    if (user.activo === 0) {
      return res.json({ ok: false, mensaje: "Usuario inactivo" });
    }

    res.json({
      ok: true,
      mensaje: "Login exitoso",
      usuario: {
        id_usuario: user.usuario_id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol: user.rol,
        sucursal_id: user.sucursal_id
      }
    });
  });
};

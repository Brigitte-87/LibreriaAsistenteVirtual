const conexion = require("../../db");

exports.getMensajeros = (req, res) => {
  const sql = `
    SELECT 
      id_mensajero,
      nombre,
      telefono,
      id_sucursal
    FROM mensajeros
    ORDER BY nombre ASC
  `;

  conexion.query(sql, (error, results) => {
    if (error) {
      console.error("Error al obtener mensajeros:", error);
      return res.status(500).json({ error: "Error al obtener mensajeros" });
    }

    res.json(results);
  });
};

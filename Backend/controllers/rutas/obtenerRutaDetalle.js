const conexion = require("../../db");

module.exports = async function obtenerRutaDetalle(req, res) {
  const { id_ruta } = req.params;

  try {
    const [rows] = await conexion.promise().query(
      `SELECT paso, lat, lng 
       FROM rutas_detalle 
       WHERE id_ruta = ?
       ORDER BY paso ASC`,
      [id_ruta]
    );

    res.json(rows);

  } catch (err) {
    console.error("Error obteniendo detalle de ruta:", err);
    res.status(500).json({ error: "Error obteniendo ruta" });
  }
};

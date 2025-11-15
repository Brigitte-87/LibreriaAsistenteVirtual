const conexion = require("../../db");

module.exports = async (req, res) => {
  const { idPedido } = req.params;

  try {
    const [rutas] = await conexion
      .promise()
      .query(
        `SELECT *
         FROM rutas_pedido
         WHERE id_pedido = ?
         ORDER BY tipo_ruta ASC`,
        [idPedido]
      );

    for (let ruta of rutas) {
      const [detalle] = await conexion
        .promise()
        .query(
          `SELECT lat, lng
           FROM rutas_detalle
           WHERE id_ruta = ?
           ORDER BY paso ASC`,
          [ruta.id_ruta]
        );

      ruta.geometry = detalle;
    }

    res.json(rutas);
  } catch (err) {
    console.error("Error obteniendo rutas:", err);
    res.status(500).json({ error: "No se pudo obtener rutas." });
  }
};

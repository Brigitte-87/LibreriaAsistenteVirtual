const conexion = require("../../db");

module.exports = (req, res) => {
  const rol = req.query.rol;
  const sucursalId = req.query.sucursal_id;
  const esDashboard = req.query.dashboard === "1" || req.query.dashboard === "true";

  if (esDashboard && rol !== "admin") {
    return res.status(403).json({ mensaje: "No autorizado para ver el dashboard" });
  }

  let sql = `
    SELECT 
      p.id_pedido,
      CONCAT(c.nombre, " ", c.apellido) AS cliente,
      s.nombre AS sucursal,
      m.nombre AS mensajero,
      p.total,
      p.tarifa_envio,
      p.estado,
      DATE_FORMAT(p.fecha, '%Y-%m-%d %H:%i') AS fecha,
      p.id_sucursal,
      p.zona,
      p.lat,
      p.lng,
      s.lat AS sucursal_lat,
      s.lng AS sucursal_lng
    FROM pedidos p
    LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
    LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
    LEFT JOIN mensajeros m ON p.id_mensajero = m.id_mensajero
  `;

  if (rol !== "admin") {
    sql += ` WHERE p.id_sucursal = ? `;
  }

  sql += ` ORDER BY p.fecha DESC `;

  const params = rol !== "admin" ? [sucursalId] : [];

  conexion.query(sql, params, (error, results) => {
    if (error) {
      console.error("Error al obtener pedidos:", error);
      return res.status(500).json({ mensaje: "Error al obtener pedidos" });
    }

    res.status(200).json(results);
  });
};

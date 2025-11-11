const conexion = require('../../db');

module.exports = (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido,
      c.nombre AS cliente,
      s.nombre AS sucursal,
      m.nombre AS mensajero,
      p.total,
      p.tarifa_envio,
      p.estado,
      DATE_FORMAT(p.fecha, '%Y-%m-%d %H:%i') AS fecha
    FROM pedidos p
    LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
    LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
    LEFT JOIN mensajeros m ON p.id_mensajero = m.id_mensajero
    ORDER BY p.fecha DESC
  `;

  conexion.query(sql, (error, results) => {
    if (error) {
      console.error("Error al obtener pedidos:", error);
      return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
    }

    if (!results || results.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(results);
  });
};

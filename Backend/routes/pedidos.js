const express = require('express');
const router = express.Router();
const conexion = require('../db');

// Controladores existentes
const obtenerPedidos = require('../controllers/pedidos/obtenerPedido');
const actualizarPedidos = require('../controllers/pedidos/actualizarPedido');

// ===============================
// 📋 Rutas principales
// ===============================
router.get('/', obtenerPedidos);
router.put('/:id/estado', actualizarPedidos);

// ===============================
// 🔍 Obtener pedido por ID (para SeguimientoPedido)
// ===============================
router.get('/:id', (req, res) => {
  const idPedido = req.params.id;

  const sql = `
    SELECT 
      p.id_pedido,
      c.nombre AS cliente,
      s.nombre AS sucursal,
      m.nombre AS mensajero,
      p.total,
      p.tarifa_envio,
      CASE p.estado
        WHEN 0 THEN 'En proceso'
        WHEN 1 THEN 'Preparando pedido'
        WHEN 2 THEN 'En ruta'
        WHEN 3 THEN 'Finalizado'
        WHEN 4 THEN 'Rechazado'
      END AS estado,
      DATE_FORMAT(p.fecha, '%Y-%m-%d %H:%i') AS fecha
    FROM pedidos p
    INNER JOIN clientes c ON p.id_cliente = c.id_cliente
    INNER JOIN sucursales s ON p.id_sucursal = s.id_sucursal
    LEFT JOIN mensajeros m ON p.id_mensajero = m.id_mensajero
    WHERE p.id_pedido = ?;
  `;

  conexion.query(sql, [idPedido], (err, results) => {
    if (err) {
      console.error('❌ Error al buscar pedido:', err);
      return res.status(500).json({ mensaje: 'Error interno al consultar el pedido' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Número de pedido no existe' });
    }

    res.json(results[0]);
  });
});

// ===============================
// 🧩 Exportar router
// ===============================
module.exports = router;

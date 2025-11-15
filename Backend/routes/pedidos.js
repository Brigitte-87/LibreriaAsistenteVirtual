const express = require("express");
const router = express.Router();

const obtenerPedidos = require("../controllers/pedidos/obtenerPedido");
const actualizarPedido = require("../controllers/pedidos/actualizarPedido");
const conexion = require("../db");
const axios = require("axios");
const crearPedido = require('../controllers/pedidos/crearPedido');
const obtenerRutaDetalle = require("../controllers/rutas/obtenerRutaDetalle");
const obtenerRutasPedido = require("../controllers/rutas/obtenerRutasPedido");

router.get("/", obtenerPedidos);
router.put("/:id/estado", actualizarPedido);
router.post('/', crearPedido)
router.get("/rutas/detalle/:id_ruta", obtenerRutaDetalle);
router.get("/:idPedido/rutas", obtenerRutasPedido);
router.get("/:id", (req, res) => {
  const idPedido = req.params.id;

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
    INNER JOIN clientes c ON p.id_cliente = c.id_cliente
    INNER JOIN sucursales s ON p.id_sucursal = s.id_sucursal
    LEFT JOIN mensajeros m ON p.id_mensajero = m.id_mensajero
    WHERE p.id_pedido = ?;
  `;

  conexion.query(sql, [idPedido], (err, results) => {
    if (err) {
      console.error("Error al buscar pedido:", err);
      return res
        .status(500)
        .json({ mensaje: "Error interno al consultar el pedido" });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Número de pedido no existe" });
    }

    res.json(results[0]);
  });
});

router.get("/:id/rutas", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conexion
      .promise()
      .query(
        `
        SELECT 
          id_ruta,
          distancia_km,
          duracion_min,
          origen_lat,
          origen_lng,
          destino_lat,
          destino_lng
        FROM rutas_pedido
        WHERE id_pedido = ?
        ORDER BY id_ruta ASC
      `,
        [id]
      );

    if (!rows.length) {
      return res.json([]);
    }
    const apiKey =
      "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZmYjhjZDI1ODk0YTQyN2Q5YTFmYTFiOGNhM2FkNWI2IiwiaCI6Im11cm11cjY0In0=";

    const url = "https://api.openrouteservice.org/v2/directions/driving-car";

    const rutasConGeo = [];

    for (const r of rows) {
      try {
        const response = await axios.post(
          url,
          {
            coordinates: [
              [Number(r.origen_lng), Number(r.origen_lat)],
              [Number(r.destino_lng), Number(r.destino_lat)],
            ],
            instructions: false,
            geometry_simplify: true,
            geometry_format: "geojson",
          },
          {
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        const route = response.data.routes[0];
        const geometry = route.geometry.coordinates.map(([lng, lat]) => ({
          lat,
          lng,
        }));

        rutasConGeo.push({
          ...r,
          distancia_km: Number(r.distancia_km),
          duracion_min: Number(r.duracion_min),
          geometry,
        });
      } catch (err) {
        console.error("Error obteniendo geometría:", err.response?.data || err);
        rutasConGeo.push({
          ...r,
          distancia_km: Number(r.distancia_km),
          duracion_min: Number(r.duracion_min),
          geometry: [],
        });
      }
    }

    res.json(rutasConGeo);
  } catch (err) {
    console.error("Error consultando rutas:", err);
    res.status(500).json({ error: "Error en servidor" });
  }
});

module.exports = router;

const conexion = require("../../db");
const { distanciaKm } = require("../../utils/distancia");

module.exports = async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ mensaje: "Se requieren lat y lng del cliente" });
  }

  try {
    const [rows] = await conexion
      .promise()
      .query(
        `SELECT id_sucursal, nombre, lat, lng 
         FROM sucursales
         WHERE lat IS NOT NULL AND lng IS NOT NULL`
      );

    if (!rows.length) {
      return res
        .status(404)
        .json({ mensaje: "No hay sucursales con coordenadas definidas" });
    }

    let mejorSucursal = null;
    let minDist = Infinity;

    const detalles = rows.map((s) => {
      const dist = distanciaKm(
        Number(lat),
        Number(lng),
        Number(s.lat),
        Number(s.lng)
      );

      if (dist < minDist) {
        minDist = dist;
        mejorSucursal = s;
      }

      return {
        id_sucursal: s.id_sucursal,
        nombre: s.nombre,
        lat: Number(s.lat),
        lng: Number(s.lng),
        distancia_km: Number(dist.toFixed(3)),
      };
    });

    return res.json({
      mejorSucursal: {
        id_sucursal: mejorSucursal.id_sucursal,
        nombre: mejorSucursal.nombre,
        lat: Number(mejorSucursal.lat),
        lng: Number(mejorSucursal.lng),
        distancia_km: Number(minDist.toFixed(3)),
      },
      sucursalesEvaluadas: detalles,
    });
  } catch (err) {
    console.error("Error calculando sucursal más cercana:", err);
    res
      .status(500)
      .json({ mensaje: "Error interno calculando sucursal más cercana" });
  }
};

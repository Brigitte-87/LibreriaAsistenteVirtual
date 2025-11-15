const axios = require("axios");
const conexion = require("../../db");

async function generarRutasAlternativas(id_pedido, id_mensajero, origen, destino) {
  try {
    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZmYjhjZDI1ODk0YTQyN2Q5YTFmYTFiOGNhM2FkNWI2IiwiaCI6Im11cm11cjY0In0=";

    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const body = {
      coordinates: [
        [origen.lng, origen.lat],
        [destino.lng, destino.lat]
      ],
      alternative_routes: {
        target_count: 3,   
        share_factor: 0.6   
      }
    };
    const response = await axios.post(url, body, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json"
      }
    });

    const rutas = response.data.features;

    if (!rutas || rutas.length === 0) {
      console.log("No se recibieron rutas alternativas");
      return false;
    }

    await conexion.promise().query("DELETE FROM rutas_pedido WHERE id_pedido = ?", [id_pedido]);

    for (let i = 0; i < rutas.length; i++) {
      const ruta = rutas[i];
      const summary = ruta.properties.summary;
      const coords = ruta.geometry.coordinates;

      const [insertRuta] = await conexion.promise().query(`
        INSERT INTO rutas_pedido
        (id_pedido, id_mensajero, origen_lat, origen_lng, destino_lat, destino_lng, 
         distancia_km, duracion_min, tipo_ruta)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id_pedido,
        id_mensajero,
        origen.lat,
        origen.lng,
        destino.lat,
        destino.lng,
        summary.distance / 1000,
        Math.round(summary.duration / 60),
        i + 1 
      ]);

      const id_ruta = insertRuta.insertId;

      for (let j = 0; j < coords.length; j++) {
        const [lng, lat] = coords[j];

        await conexion.promise().query(`
          INSERT INTO rutas_detalle (id_ruta, paso, lat, lng)
          VALUES (?, ?, ?, ?)
        `, [id_ruta, j + 1, lat, lng]);
      }
    }

    console.log("Rutas alternativas reales generadas");
    return true;

  } catch (err) {
    console.error("Error generando rutas alternativas:", err.response?.data || err);
    return false;
  }
}

module.exports = generarRutasAlternativas;

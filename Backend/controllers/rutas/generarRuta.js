const axios = require("axios");
const conexion = require("../../db");

async function generarRutaPedido(id_pedido, id_mensajero, origen, destino) {
  try {
    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZmYjhjZDI1ODk0YTQyN2Q5YTFmYTFiOGNhM2FkNWI2IiwiaCI6Im11cm11cjY0In0=";
    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const response = await axios.post(
      url,
      {
        coordinates: [
          [origen.lng, origen.lat],
          [destino.lng, destino.lat]
        ]
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    const ruta = response.data.features[0];
    const summary = ruta.properties.summary;
    const coords = ruta.geometry.coordinates;
    const sqlRuta = `
      INSERT INTO rutas_pedido 
      (id_pedido, id_mensajero, origen_lat, origen_lng, destino_lat, destino_lng, distancia_km, duracion_min)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [insertRuta] = await conexion
      .promise()
      .query(sqlRuta, [
        id_pedido,
        id_mensajero,
        origen.lat,
        origen.lng,
        destino.lat,
        destino.lng,
        summary.distance / 1000,
        Math.round(summary.duration / 60)
      ]);

    const id_ruta = insertRuta.insertId;
    const sqlDetalle = `
      INSERT INTO rutas_detalle (id_ruta, paso, lat, lng)
      VALUES (?, ?, ?, ?)
    `;

    for (let i = 0; i < coords.length; i++) {
      const [lng, lat] = coords[i];
      await conexion.promise().query(sqlDetalle, [
        id_ruta,
        i + 1,
        lat,
        lng
      ]);
    }

    console.log("Ruta principal generada correctamente");
    return true;

  } catch (err) {
    console.error("Error generando ruta:", err.response?.data || err);
    return false;
  }
}

module.exports = generarRutaPedido;

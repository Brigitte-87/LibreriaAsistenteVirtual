const conexion = require("../../db");
const generarRutasAlternativas = require("../rutas/generarRutasAlternativas");

module.exports = async function actualizarPedido(req, res) {
  const { id } = req.params;
  const { estado, id_mensajero } = req.body;

  const sql = `
    UPDATE pedidos
    SET estado = ?, id_mensajero = ?
    WHERE id_pedido = ?
  `;

  conexion.query(sql, [estado, id_mensajero, id], async (err) => {
    if (err) {
      console.error("Error al actualizar pedido:", err);
      return res.status(500).json({ mensaje: "Error interno" });
    }

    console.log("Estado recibido:", estado);

    if (Number(estado) === 2) {
      console.log("→ Generando rutas para el pedido", id);

      try {
        const [rowsSucursal] = await conexion
          .promise()
          .query(`
            SELECT s.lat AS lat, s.lng AS lng
            FROM sucursales s
            INNER JOIN pedidos p ON p.id_sucursal = s.id_sucursal
            WHERE p.id_pedido = ?
          `, [id]);

        const [rowsPedido] = await conexion
          .promise()
          .query(`
            SELECT lat AS lat, lng AS lng
            FROM pedidos
            WHERE id_pedido = ?
          `, [id]);

        if (!rowsSucursal.length || !rowsPedido.length) {
          console.log("No se encontraron coordenadas válidas");
          return res.json({ mensaje: "Pedido actualizado, sin rutas" });
        }

        const origen = rowsSucursal[0];
        const destino = rowsPedido[0];

        await generarRutasAlternativas(
          id,
          id_mensajero,
          { lat: origen.lat, lng: origen.lng },
          { lat: destino.lat, lng: destino.lng }
        );

      } catch (e) {
        console.error("Error generando rutas:", e);
      }
    }

    res.json({ mensaje: "Pedido actualizado" });
  });
};

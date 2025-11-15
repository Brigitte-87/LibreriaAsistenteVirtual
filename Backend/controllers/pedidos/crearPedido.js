const conexion = require("../../db");

module.exports = (req, res) => {
  const { 
    nombre, 
    apellido, 
    telefono, 
    nit, 
    dpi, 
    direccion, 
    zona, 
    lat, 
    lng, 
    total, 
    estado,
    libros,
    id_sucursal
  } = req.body;

  console.log("Datos recibidos:", req.body);

  if (!nombre || !apellido || !telefono || !nit || !dpi || !direccion || !zona || !lat || !lng || !id_sucursal) {
    return res.status(400).json({ error: "Faltan datos obligatorios del pedido." });
  }

  const sqlCliente = `
    INSERT INTO clientes (nombre, apellido, telefono, nit, dpi)
    VALUES (?, ?, ?, ?, ?)
  `;

  conexion.query(
    sqlCliente, 
    [nombre, apellido, telefono, nit, dpi],
    (errCliente, resultCliente) => {
      if (errCliente) {
        console.error("Error al insertar cliente:", errCliente.sqlMessage);
        return res.status(500).json({ error: "Error al registrar cliente", detalle: errCliente.sqlMessage });
      }

      const idCliente = resultCliente.insertId;
      console.log("Cliente insertado con ID:", idCliente);

      const numZona = parseInt(zona, 10) || 1;

      let tarifa_envio = 15;
      if (numZona > 5 && numZona <= 10) tarifa_envio = 25;
      else if (numZona > 10 && numZona <= 15) tarifa_envio = 35;
      else if (numZona > 15) tarifa_envio = 40;

      const totalFinal = total + tarifa_envio;

      const sqlPedido = `
        INSERT INTO pedidos 
        (id_cliente, id_sucursal, id_mensajero, total, tarifa_envio, fecha, estado, direccion, zona, lat, lng)
        VALUES (?, ?, NULL, ?, ?, NOW(), ?, ?, ?, ?, ?)
      `;

      conexion.query(
        sqlPedido,
        [
          idCliente,
          id_sucursal,
          totalFinal,
          tarifa_envio,
          estado ?? 0,
          direccion,
          zona,
          lat,
          lng,
        ],
        (errPedido, resultPedido) => {
          if (errPedido) {
            console.error("Error al crear pedido:", errPedido.sqlMessage);
            return res.status(500).json({
              error: "Error al registrar pedido",
              detalle: errPedido.sqlMessage
            });
          }

          const idPedido = resultPedido.insertId;
          console.log("Pedido creado con ID:", idPedido, "Sucursal:", id_sucursal);

          if (Array.isArray(libros) && libros.length > 0) {
            const sqlDetalle = `
              INSERT INTO pedido_detalle (id_pedido, titulo, cantidad, precio_unitario)
              VALUES ?
            `;

            const values = libros.map((lib) => [
              idPedido,
              lib.titulo,
              lib.cantidad || 1,
              lib.precio,
            ]);

            conexion.query(sqlDetalle, [values], (errDet) => {
              if (errDet) {
                console.error("Error agregando detalle del pedido:", errDet.sqlMessage);
              }
            });
          }

          res.status(200).json({
            pedidoId: idPedido,
            totalFinal,
            cliente: `${nombre} ${apellido}`,
            sucursalId: id_sucursal,
            mensaje: "Pedido confirmado correctamente",
          });
        }
      );
    }
  );
};

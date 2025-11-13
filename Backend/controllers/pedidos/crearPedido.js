const conexion = require("../../db");

// ==========================================
// ✅ CREAR NUEVO PEDIDO (desde el frontend Envio.js)
// ==========================================
module.exports = (req, res) => {
  const { nombre, apellido, telefono, nit, dpi, direccion, zona, total } = req.body;

  console.log("📦 Datos recibidos:", req.body);

  if (!nombre || !apellido || !telefono || !nit || !dpi || !direccion || !zona) {
    return res.status(400).json({ error: "Faltan datos del cliente" });
  }

  // 1️⃣ Insertar cliente
  const sqlCliente = `
    INSERT INTO clientes (nombre, apellido, telefono, nit, dpi, direccion, zona)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  conexion.query(sqlCliente, [nombre, apellido, telefono, nit, dpi, direccion, zona], (err, resultCliente) => {
    if (err) {
      console.error("❌ Error al insertar cliente:", err.sqlMessage);
      return res.status(500).json({ error: "Error al registrar cliente", detalle: err.sqlMessage });
    }

    const idCliente = resultCliente.insertId;
    console.log("✅ Cliente insertado con ID:", idCliente);

    // 2️⃣ Calcular costo de envío
    const numZona = parseInt(zona.replace(/\D/g, "")) || 1;
    let tarifa_envio = 15;
    if (numZona > 5 && numZona <= 10) tarifa_envio = 25;
    else if (numZona > 10 && numZona <= 15) tarifa_envio = 35;
    else if (numZona > 15) tarifa_envio = 40;

    const totalFinal = total + tarifa_envio;

    // 3️⃣ Crear pedido
    const sqlPedido = `
      INSERT INTO pedidos (id_cliente, id_sucursal, id_mensajero, total, tarifa_envio, fecha, estado)
      VALUES (?, 4, 4, ?, ?, NOW(), 'pendiente')
    `;

    conexion.query(sqlPedido, [idCliente, total, tarifa_envio], (err2, resultPedido) => {
      if (err2) {
        console.error("❌ Error al crear pedido:", err2.sqlMessage);
        return res.status(500).json({ error: "Error al registrar pedido", detalle: err2.sqlMessage });
      }

      console.log("✅ Pedido creado con ID:", resultPedido.insertId);

      // 4️⃣ Respuesta exitosa
      res.status(200).json({
        pedidoId: resultPedido.insertId,
        totalFinal,
        cliente: `${nombre} ${apellido}`,
        mensaje: "Pedido confirmado correctamente",
        sucursal: "Sucursal Central",
        mensajero: "Asignado automáticamente",
      });
    });
  });
};

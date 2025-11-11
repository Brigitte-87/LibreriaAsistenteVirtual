// ================================
// 📦 LIBRERÍAS Y CONFIGURACIÓN BASE
// ================================
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuid } = require('uuid');
const conexion = require('./db');

const app = express();
const PORT = 4000;

// ================================
// 🧩 MIDDLEWARES
// ================================
app.use(cors());
app.use(express.json());

// ===============================================
// ✅ RUTA: OBTENER TODOS LOS PEDIDOS (para React)
// ===============================================
app.get('/api/pedidos', (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido, 
      c.nombre AS cliente, 
      c.zona, 
      s.nombre AS sucursal, 
      m.nombre AS mensajero, 
      p.total, 
      p.tarifa_envio AS envio, 
      p.estado, 
      DATE_FORMAT(p.fecha, '%e/%m/%Y') AS fecha
    FROM pedidos p
    LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
    LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
    LEFT JOIN mensajeros m ON p.id_mensajero = m.id_mensajero
    ORDER BY p.id_pedido DESC;
  `;

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error('❌ Error al obtener pedidos:', error);
      return res.status(500).json({ mensaje: 'Error al obtener los pedidos' });
    }
    res.json(resultados);
  });
});

// ===============================================
// ✅ RUTA: REGISTRAR UN NUEVO PEDIDO AUTOMÁTICO
// ===============================================
app.post('/api/pedidos', (req, res) => {
  const { nombre, direccion, zona, total } = req.body;

  // 🧾 Validación básica
  if (!nombre || !direccion || !zona || !total) {
    return res.status(400).json({ mensaje: 'Faltan datos del pedido' });
  }

  // ======================================
  // 🧠 Asignación automática por zona
  // ======================================
  let idSucursal, idMensajero, tarifaEnvio, sucursalNombre, mensajeroNombre;

  if (zona.includes('Zona 1') || zona.includes('Zona 5')) {
    idSucursal = 4; idMensajero = 4; tarifaEnvio = 15.00;
    sucursalNombre = 'Sucursal Zona 1';
    mensajeroNombre = 'Carlos López';
  } else if (zona.includes('Zona 10')) {
    idSucursal = 5; idMensajero = 5; tarifaEnvio = 20.00;
    sucursalNombre = 'Sucursal Zona 10';
    mensajeroNombre = 'María Pérez';
  } else {
    idSucursal = 6; idMensajero = 6; tarifaEnvio = 25.00;
    sucursalNombre = 'Sucursal Boca del Monte';
    mensajeroNombre = 'José Ramírez';
  }

  // ======================================
  // 🔎 Verificar que la sucursal y mensajero existan
  // ======================================
  const sqlVerificacion = `
    SELECT 
      (SELECT COUNT(*) FROM sucursales WHERE id_sucursal = ?) AS sucursalExiste,
      (SELECT COUNT(*) FROM mensajeros WHERE id_mensajero = ?) AS mensajeroExiste
  `;
  conexion.query(sqlVerificacion, [idSucursal, idMensajero], (errorVerif, resultados) => {
    if (errorVerif) {
      console.error('❌ Error al verificar relaciones:', errorVerif);
      return res.status(500).json({ mensaje: 'Error al verificar relaciones en la base de datos' });
    }

    const { sucursalExiste, mensajeroExiste } = resultados[0];
    if (!sucursalExiste || !mensajeroExiste) {
      return res.status(400).json({ 
        mensaje: '❌ La sucursal o el mensajero asignado no existen. Verifica los IDs en la base de datos.'
      });
    }

    // ======================================
    // 👤 Paso 1: Insertar cliente
    // ======================================
    const sqlCliente = 'INSERT INTO clientes (nombre, direccion, zona) VALUES (?, ?, ?)';
    conexion.query(sqlCliente, [nombre, direccion, zona], (errorCliente, resultadoCliente) => {
      if (errorCliente) {
        console.error('❌ Error al insertar cliente:', errorCliente);
        return res.status(500).json({ mensaje: 'Error al registrar el cliente' });
      }

      const idCliente = resultadoCliente.insertId;

      // ======================================
      // 📦 Paso 2: Insertar pedido
      // ======================================
      const sqlPedido = `
        INSERT INTO pedidos (id_cliente, id_sucursal, id_mensajero, total, tarifa_envio, fecha, estado)
        VALUES (?, ?, ?, ?, ?, NOW(), 'pendiente')
      `;
      conexion.query(sqlPedido, [idCliente, idSucursal, idMensajero, total, tarifaEnvio], (errorPedido) => {
        if (errorPedido) {
          console.error('❌ Error al insertar pedido:', errorPedido);
          return res.status(500).json({ mensaje: 'Error al registrar el pedido' });
        }

        // ======================================
        // ✅ Respuesta final al frontend
        // ======================================
        res.json({
          mensaje: '✅ Pedido confirmado correctamente',
          pago: 'Pago contra entrega',
          sucursal: sucursalNombre,
          mensajero: mensajeroNombre,
          totalFinal: total
        });
      });
    });
  });
});

// ===============================================
// 💬 CHAT CON DIALOGFLOW
// ===============================================
app.post('/api/chat', async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ error: "Mensaje vacío" });

  try {
    const sessionId = uuid();
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: path.join(__dirname, 'dialogflow-key.json'),
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      "libreriaasistentevirtual-tx9n", // ID del proyecto Dialogflow
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: mensaje,
          languageCode: 'es',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const respuesta = responses[0].queryResult.fulfillmentText || "No tengo una respuesta para eso 😅";

    res.json({ respuesta });
  } catch (error) {
    console.error("❌ Error en Dialogflow:", error);
    res.status(500).json({ error: "Error al comunicarse con Dialogflow" });
  }
});

// ===============================================
// 🚀 INICIAR SERVIDOR
// ===============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log("✅ Conexión exitosa con la base de datos MySQL");
});

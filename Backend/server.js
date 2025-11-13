// ================================
// 📦 LIBRERÍAS Y CONFIGURACIÓN BASE
// ================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuid } = require('uuid');
const conexion = require('./db'); // ✅ Ruta corregida

// Inicializamos Express
const app = express();
const PORT = 4000;

// ================================
// 🧩 MIDDLEWARES
// ================================
app.use(cors());
app.use(express.json());

// ================================
// 🧾 RUTAS DE LA API
// ================================
const pedidosRoutes = require('./routes/pedidos');
app.use('/api/pedidos', pedidosRoutes);

const mensajerosRoutes = require('./routes/mensajeros');
app.use('/api/mensajeros', mensajerosRoutes);

// ================================
// 💬 CHAT CON DIALOGFLOW
// ================================
app.post('/api/chat', async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ error: "Mensaje vacío" });

  try {
    const sessionId = uuid();
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: path.join(__dirname, 'dialogflow-key.json'),
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      "libreriaasistentevirtual-tx9n", // 👈 tu ID de proyecto Dialogflow
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
    const respuesta =
      responses[0].queryResult.fulfillmentText || "No tengo una respuesta para eso 😅";

    res.json({ respuesta });
  } catch (error) {
    console.error("❌ Error en Dialogflow:", error);
    res.status(500).json({ error: "Error al comunicarse con Dialogflow" });
  }
});

// ================================
// 🚀 INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log("✅ Conexión exitosa con la base de datos MySQL");
});

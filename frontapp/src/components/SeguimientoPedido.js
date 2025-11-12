import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./SeguimientoPedido.css";

import recibido from "../assets/seguimiento/pedidorecibido.jpg";
import preparando from "../assets/seguimiento/preparandopedido.jpg";
import ruta from "../assets/seguimiento/enruta.jpg";
import entregado from "../assets/seguimiento/entregado.jpg";
import camionIcon from "../assets/seguimiento/enruta.jpg"; // o camion.gif si lo tienes

export default function SeguimientoPedido() {
  const [numero, setNumero] = useState("");
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  const buscarPedido = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/pedidos/${numero}`);
      setPedido(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ No se encontró el pedido.");
      setPedido(null);
    }
  };

  const getEstadoTexto = (estado) => {
    switch (Number(estado)) {
      case 0: return "En Proceso";
      case 1: return "Preparando Pedido";
      case 2: return "En Ruta";
      case 3: return "Finalizado";
      case 4: return "Rechazado";
      default: return "Desconocido";
    }
  };

  const etapas = [
    { nombre: "Pedido Recibido", img: recibido },
    { nombre: "Preparando Pedido", img: preparando },
    { nombre: "En Ruta", img: ruta },
    { nombre: "Entregado", img: entregado },
  ];

  const estadoActual = pedido ? Number(pedido.estado) : -1;
  const posiciones = [0, 33, 66, 100]; // porcentaje de avance para el camión
  const anchoProgreso = estadoActual === 3 ? 100 : posiciones[estadoActual] || 0;

  return (
    <div className="seguimiento-wrapper">
      <header className="seguimiento-header">
        <h1>🚚 Seguimiento de Pedido</h1>
        <p>Monitorea en tiempo real el avance de tu entrega.</p>
      </header>

      {!pedido ? (
        <div className="buscador-box">
          <h3>🔍 Ingresar número de pedido</h3>
          <input
            type="text"
            placeholder="Ej. 255"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn-confirmar" onClick={buscarPedido}>
            Confirmar
          </button>
        </div>
      ) : (
        <>
          <section className="panel-info">
            <h2>📋 Resumen del pedido #{pedido.id_pedido}</h2>
            <p><strong>Cliente:</strong> {pedido.cliente}</p>
            <p><strong>Sucursal:</strong> {pedido.sucursal}</p>
            <p><strong>Mensajero:</strong> {pedido.mensajero || "—"}</p>
            <p><strong>Total:</strong> Q{pedido.total}.00</p>
            <p><strong>Envío:</strong> Q{pedido.tarifa_envio}.00</p>
            <p><strong>Fecha:</strong> {pedido.fecha}</p>
            <p className={`estado estado-${estadoActual}`}>
              {getEstadoTexto(pedido.estado)}
            </p>
          </section>

          {/* Si el pedido fue rechazado */}
          {estadoActual === 4 ? (
            <section className="panel-rechazado">
              <h2>❌ Pedido Rechazado</h2>
              <p>
                Este pedido fue cancelado o rechazado.  
                Si crees que se trata de un error, comunícate con la sucursal.
              </p>
              <button className="btn-volver" onClick={() => setPedido(null)}>
                🔁 Buscar otro pedido
              </button>
            </section>
          ) : (
            <section className="panel-progreso">
              <h2>📦 Estado del Proceso</h2>

              <div className="ruta-container">
                <div className="ruta-linea">
                  {/* Línea verde dinámica */}
                  <motion.div
                    className="linea-progreso"
                    animate={{ width: `${anchoProgreso}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Camión animado */}
                  <motion.div
                    className="camion"
                    animate={{ left: `${anchoProgreso}%` }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <img src={camionIcon} alt="camión" />
                  </motion.div>

                  {etapas.map((et, i) => (
                    <div key={i} className={`checkpoint ${i <= estadoActual ? "activo" : ""}`}>
                      <img src={et.img} alt={et.nombre} />
                      <span>{et.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-volver" onClick={() => setPedido(null)}>
                🔁 Buscar otro pedido
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}

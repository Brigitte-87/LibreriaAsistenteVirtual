import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./SeguimientoPedido.css";

import recibido from "../assets/seguimiento/pedidorecibido.jpg";
import preparando from "../assets/seguimiento/preparandopedido.jpg";
import ruta from "../assets/seguimiento/enruta.jpg";
import entregado from "../assets/seguimiento/entregado.jpg";
import camionIcon from "../assets/seguimiento/enruta.jpg"; // aquí pon tu icono/gif de camión

// 📚 Libros para las promos (mismos del catálogo)
const librosPromo = [
  {
    id: 2,
    titulo: "El Principito",
    precio: 70,
    imagen: "/img/libros/elprincipito.jpg",
    etiqueta: "Nuevo libro",
    mensaje: "No te lo pierdas",
  },
  {
    id: 4,
    titulo: "Matilda",
    precio: 180,
    imagen: "/img/libros/matilda.jpg",
    etiqueta: "Recomendado",
    mensaje: "Ideal para lectores curiosos",
  },
];

const libroNuevo = librosPromo[0];
const libroRecomendado = librosPromo[1];

export default function SeguimientoPedido() {
  const [numero, setNumero] = useState("");
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  const buscarPedido = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/pedidos/${numero}`);
      console.log("Respuesta pedido:", res.data);
      setPedido(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ No se encontró el pedido.");
      setPedido(null);
    }
  };

  // 🔄 Normalizamos el estado que venga del backend (número o texto)
  const parseEstado = (valorEstado) => {
    if (valorEstado === null || valorEstado === undefined) return -1;

    const num = Number(valorEstado);
    if (!Number.isNaN(num)) return num; // 0,1,2,3,4

    const txt = valorEstado.toString().toLowerCase().trim();

    if (txt.includes("recibido") || txt.includes("proceso")) return 0;
    if (txt.includes("preparando")) return 1;
    if (txt.includes("ruta")) return 2;
    if (txt.includes("finalizado") || txt.includes("entregado")) return 3;
    if (txt.includes("rechazado") || txt.includes("cancelado")) return 4;

    return -1;
  };

  const getEstadoTexto = (estadoNum) => {
    switch (estadoNum) {
      case 0:
        return "En Proceso / Pedido recibido";
      case 1:
        return "Preparando Pedido";
      case 2:
        return "En Ruta";
      case 3:
        return "Finalizado";
      case 4:
        return "Rechazado";
      default:
        return "Desconocido";
    }
  };

  const etapas = [
    { nombre: "Pedido Recibido", img: recibido },
    { nombre: "Preparando Pedido", img: preparando },
    { nombre: "En Ruta", img: ruta },
    { nombre: "Entregado", img: entregado },
  ];

  const estadoActual = pedido ? parseEstado(pedido.estado) : -1;
  const totalEtapas = etapas.length - 1; // 3 (0,1,2,3)

  // 🔢 estado → porcentaje (0% a 100%)
  const calcularProgreso = (estado) => {
    if (estado < 0) return 0;
    if (estado > totalEtapas) return 100;
    return (estado / totalEtapas) * 100;
  };

  const anchoProgreso = calcularProgreso(estadoActual);

  return (
    <div className="seguimiento-wrapper">
      <header className="seguimiento-header">
        <h1>🚚 Seguimiento de Pedido</h1>
        <p>Monitorea en tiempo real el avance de tu entrega.</p>
      </header>

      {/* ==================== BUSCADOR ==================== */}
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
          {/* ==================== RESUMEN + ANUNCIOS EN LA MISMA LÍNEA ==================== */}
        <section className="resumen-layout">
          {/* Anuncio izquierda */}
          <article className="promo-libro promo-flotante">
            <span className="promo-arrow">👉</span>
            <p className="promo-etiqueta">{libroNuevo.etiqueta}</p>
            <img
              src={libroNuevo.imagen}
              alt={libroNuevo.titulo}
              className="promo-imagen"
            />
            <h3 className="promo-titulo">{libroNuevo.titulo}</h3>
            <p className="promo-texto">{libroNuevo.mensaje}</p>
            <p className="promo-precio">Precio: Q{libroNuevo.precio}</p>
          </article>

          {/* Resumen central */}
          <section className="panel-info">
            <h2>📋 Resumen del pedido #{pedido.id_pedido}</h2>
            <p>
              <strong>Cliente:</strong> {pedido.cliente}
            </p>
            <p>
              <strong>Sucursal:</strong> {pedido.sucursal}
            </p>
            <p>
              <strong>Mensajero:</strong> {pedido.mensajero || "—"}
            </p>
            <p>
              <strong>Total:</strong> Q{pedido.total}.00
            </p>
            <p>
              <strong>Envío:</strong> Q{pedido.tarifa_envio}.00
            </p>
            <p>
              <strong>Fecha:</strong> {pedido.fecha}
            </p>

            <p className={`estado estado-${estadoActual}`}>
              {getEstadoTexto(estadoActual)}
            </p>
          </section>

          {/* Anuncio derecha */}
          <article className="promo-libro promo-flotante">
            <span className="promo-arrow">👉</span>
            <p className="promo-etiqueta">{libroRecomendado.etiqueta}</p>
            <img
              src={libroRecomendado.imagen}
              alt={libroRecomendado.titulo}
              className="promo-imagen"
            />
            <h3 className="promo-titulo">{libroRecomendado.titulo}</h3>
            <p className="promo-texto">{libroRecomendado.mensaje}</p>
            <p className="promo-precio">Precio: Q{libroRecomendado.precio}</p>
          </article>
        </section>


          {/* ==================== RECHAZADO ==================== */}
          {estadoActual === 4 ? (
            <section className="panel-rechazado">
              <h2>❌ Pedido Rechazado</h2>
              <p>
                Este pedido fue cancelado o rechazado. Si crees que se trata de
                un error, comunícate con la sucursal.
              </p>
              <button
                className="btn-volver"
                onClick={() => {
                  setPedido(null);
                  setNumero("");
                  setError("");
                }}
              >
                🔁 Buscar otro pedido
              </button>
            </section>
          ) : (
            /* ==================== PROGRESO (GRANDE Y LARGO) ==================== */
            <section className="panel-progreso panel-progreso-full">
              <div className="panel-progreso-header">
                <div>
                  <h2>📦 Estado del Proceso</h2>
                  <p className="subtitulo-progreso">
                    Etapa actual:
                    <span
                      className={`badge-etapa badge-etapa-${estadoActual}`}
                    >
                      {getEstadoTexto(estadoActual)}
                    </span>
                  </p>
                </div>

                <div className="progreso-meta">
                  <span className="label-meta">Avance</span>
                  <span className="valor-meta">
                    {Math.round(anchoProgreso)}%
                  </span>
                </div>
              </div>

              <div className="ruta-container">
                <div className="ruta-linea">
                  {/* Línea verde dinámica */}
                  <motion.div
                    key={estadoActual}
                    className="linea-progreso"
                    initial={{ width: 0 }}
                    animate={{ width: `${anchoProgreso}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Camión */}
                  <motion.div
                    key={`camion-${estadoActual}`}
                    className="camion"
                    initial={{ left: 0 }}
                    animate={{ left: `${anchoProgreso}%` }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <img src={camionIcon} alt="camión" />
                  </motion.div>

                  {/* Checkpoints */}
                  {etapas.map((et, i) => (
                    <div
                      key={i}
                      className={`checkpoint ${
                        i <= estadoActual ? "activo" : ""
                      } ${i === estadoActual ? "checkpoint-actual" : ""}`}
                    >
                      <div className="checkpoint-dot" />
                      <img src={et.img} alt={et.nombre} />
                      <span className="checkpoint-etapa">{et.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn-volver"
                onClick={() => {
                  setPedido(null);
                  setNumero("");
                  setError("");
                }}
              >
                🔁 Buscar otro pedido
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
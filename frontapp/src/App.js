import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Carrito from "./components/Carrito";
import CatalogoLibros from "./components/CatalogoLibros";
import ChatBot from "./components/ChatBot";
import Envio from "./components/Envio";
import Pedidos from "./components/pedidos/Pedidos";
import "./App.css";
import ProcesoPedido from "./components/ProcesoPedido";

function App() {
  // 🛒 Carrito (vista cliente)
  const [carrito, setCarrito] = useState([]);

  // 🚚 Control de vista del formulario de envío
  const [mostrarEnvio, setMostrarEnvio] = useState(false);

  // ➕ Agregar libro al carrito (sin duplicar)
  const agregarAlCarrito = (libro) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === libro.id);
      if (existe) {
        return prev.map((item) =>
          item.id === libro.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...libro, cantidad: 1 }];
      }
    });
  };

  // ❌ Eliminar libro del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  // ✏️ Actualizar cantidad manualmente
  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Number(nuevaCantidad)) }
          : item
      )
    );
  };

  // 💰 Calcular total actual
  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <Router>
      <div style={{ fontFamily: "Arial", padding: "10px" }}>
        <Routes>
          {/* ==================== VISTA CLIENTE ==================== */}
          <Route
            path="/"
            element={
              !mostrarEnvio ? (
                <>
                  <h1 style={{ textAlign: "center" }}>📚 Catálogo de Libros</h1>
                  <CatalogoLibros onAgregar={agregarAlCarrito} />
                  <Carrito
                    items={carrito}
                    onEliminar={eliminarDelCarrito}
                    onCantidadChange={actualizarCantidad}
                    onFinalizar={() => setMostrarEnvio(true)}
                  />
                  <ChatBot />
                </>
              ) : (
                // ==================== VISTA DE ENVÍO ====================
                <Envio
                  total={totalCarrito}
                  onVolver={() => setMostrarEnvio(false)}
                />
              )
            }
          />

          {/* ==================== VISTA DE PEDIDOS ==================== */}
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/proceso/:id" element={<ProcesoPedido />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

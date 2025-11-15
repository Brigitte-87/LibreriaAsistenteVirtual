import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Carrito from "./components/Carrito";
import CatalogoLibros from "./components/CatalogoLibros";
import ChatBot from "./components/ChatBot";
import Envio from "./components/Envio";
import Pedidos from "./components/pedidos/Pedidos";
import ProcesoPedido from "./components/ProcesoPedido";
import PedidosAnalisisDashboard from "./pages/pedidos/PedidosDashboard";
import PedidosHungaro from "./pages/pedidos/PedidosHungaro";
import SeguimientoPedido from "./components/SeguimientoPedido";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarEnvio, setMostrarEnvio] = useState(false);

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

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Number(nuevaCantidad)) }
          : item
      )
    );
  };

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <Router>
      <div style={{ fontFamily: "Arial" }}>
        <Routes>
          
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
                <Envio
                  total={totalCarrito}
                  librosCarrito={carrito}
                  onVolver={() => setMostrarEnvio(false)}
                />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/seguimientopedido" element={<SeguimientoPedido />} />
          <Route path="/pedidos"
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/proceso/:id"
            element={
              <ProtectedRoute>
                <ProcesoPedido />
              </ProtectedRoute>
            }
          />

        <Route path="/pedidos/dashboard" element={<PedidosAnalisisDashboard />} />
        <Route path="/pedidos/hungaro" element={<PedidosHungaro />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

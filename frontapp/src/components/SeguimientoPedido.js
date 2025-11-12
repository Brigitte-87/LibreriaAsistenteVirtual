import React, { useState } from "react";
import "./SeguimientoPedido.css";

function SeguimientoPedido() {
  const [mostrarModal, setMostrarModal] = useState(true);
  const [numeroPedido, setNumeroPedido] = useState("");

  const cerrarModal = () => setMostrarModal(false);

  const buscarPedido = () => {
    if (!numeroPedido.trim()) {
      alert("Por favor ingresa un número de pedido");
      return;
    }
    alert("Buscando pedido #" + numeroPedido);
  };

  return (
    <div className="seguimiento-container">
      <h2>🔎 Seguimiento de Pedido</h2>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📦 Ingresar número de pedido</h3>

            <input
              type="text"
              className="input-pedido"
              placeholder="Ej. 10"
              value={numeroPedido}
              onChange={(e) => setNumeroPedido(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="btn-confirmar" onClick={buscarPedido}>
                Confirmar
              </button>
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="texto-info">Pantalla en blanco (luego la llenamos)</p>
    </div>
  );
}

export default SeguimientoPedido;

import React from "react";
import "./Carrito.css";

function Carrito({ items, onEliminar, onCantidadChange, onFinalizar }) {

  // 🎨 Colores según categoría
  const obtenerColorCategoria = (categoria) => {
    const colores = {
      "📖 Clásicos": "#e63946",
      "👦 Literatura infantil": "#007bff",
      "🧛‍♀️ Juvenil / Fantasía": "#ffd700",
    };
    return colores[categoria] || "#7EC384"; // color por defecto
  };

  // Calcular total general
  const total = items.reduce(
    (sum, item) => sum + item.precio * (item.cantidad || 1),
    0
  );

  return (
    <div className="carrito-container">
      <h3 className="carrito-titulo">🛒 Mi carrito</h3>

      {items.length === 0 ? (
        <p className="carrito-vacio">Tu carrito está vacío</p>
      ) : (
        <table className="carrito-tabla">
          <thead>
            <tr>
              <th>Libro</th>
              <th>Precio</th>
              <th>Cant.</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="libro-info">
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    style={{
                      border: `3px solid ${obtenerColorCategoria(item.categoria)}`,
                      borderRadius: "6px"
                    }}
                  />
                  <span>{item.titulo}</span>
                </td>

                <td>Q{item.precio}</td>

                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      onCantidadChange(item.id, e.target.value)
                    }
                  />
                </td>

                <td>Q{item.precio * item.cantidad}</td>

                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => onEliminar(item.id)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 className="carrito-total">Total: Q{total}</h4>

      {items.length > 0 && (
        <button className="btn-finalizar" onClick={onFinalizar}>
          Finalizar pedido
        </button>
      )}
    </div>
  );
}

export default Carrito;

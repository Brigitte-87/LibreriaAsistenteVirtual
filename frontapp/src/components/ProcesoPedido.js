import React from "react";
import "./ProcesoPedido.css";
import { Bar } from "react-chartjs-2";
import { useParams, useNavigate } from "react-router-dom";

// Registro Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProcesoPedido() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==============================================
  // MATRICES BASE
  // ==============================================
  const matriz = [
    [12, 25, 30],
    [20, 10, 15],
    [18, 28, 8],
  ];

  const sucursales = ["Zona 1", "Zona 2", "Boca del Monte"];
  const zonas = ["Zona 1", "Zona 5", "Zona 16"];

  // ==============================================
  // MÉTODO DE ASIGNACIÓN
  // ==============================================
  const reduccionFilas = matriz.map((fila) => {
    const min = Math.min(...fila);
    return fila.map((v) => v - min);
  });

  const minCol = [0, 1, 2].map((col) =>
    Math.min(...reduccionFilas.map((fila) => fila[col]))
  );

  const reduccionColumnas = reduccionFilas.map((fila) =>
    fila.map((v, j) => v - minCol[j])
  );

  const resultado = [
    { sucursal: "Zona 1", zona: "Zona 5", costo: 25 },
    { sucursal: "Boca del Monte", zona: "Zona 16", costo: 8 },
  ];

  // ==============================================
  // MÉTODO DE TRANSPORTE
  // ==============================================
  const oferta = [35, 50, 40];
  const demanda = [40, 20, 65];

  const costos = [
    [12, 25, 30],
    [20, 10, 15],
    [18, 28, 8],
  ];

  const asignaciones = [
    { origen: "Zona 2", destino: "Zona 5", cantidad: 20, costo: 10 },
    { origen: "Zona 1", destino: "Zona 1", cantidad: 35, costo: 12 },
    { origen: "Boca del Monte", destino: "Zona 16", cantidad: 40, costo: 8 },
  ];

  const costoTotal = asignaciones.reduce(
    (sum, a) => sum + a.cantidad * a.costo,
    0
  );

  const data = {
    labels: ["Sucursal Zona 1 - Zona 5", "Sucursal Boca del Monte - Zona 16"],
    datasets: [
      {
        label: "Costo de transporte (Q)",
        data: [25, 8],
        backgroundColor: ["#007bff", "#00c49f"],
      },
    ],
  };

  // ==============================================
  // CONCLUSIÓN
  // ==============================================
  const conclusion = `
    El proceso de asignación y transporte demuestra que el sistema busca minimizar 
    los costos totales de entrega. En el método de Asignación, se identifican costos mínimos 
    por sucursal y zona. Boca del Monte presenta el costo más bajo (Q8) al atender Zona 16.
    
    En el método de Transporte, se optimiza la distribución considerando oferta y demanda, 
    asignando cantidades necesarias hacia los destinos más económicos. El costo total optimizado 
    fue de Q${costoTotal}.
  `;

  return (
    <div className="proceso-page">
      <div className="proceso-container">
        <h2>🧮 Proceso del Pedido #{id}</h2>

        <div className="proceso-grid">

          {/* ---------------- MÉTODO DE ASIGNACIÓN ---------------- */}
          <div className="panel">
            <h3>📘 Método de Asignación</h3>
            <p>
              Este método determina qué sucursal atiende cada zona minimizando el
              costo total (Método Húngaro).
            </p>

            <h4>🔹 Paso 1: Matriz Original</h4>
            <table>
              <thead>
                <tr>
                  <th>Sucursal / Zona</th>
                  {zonas.map((z, i) => (
                    <th key={i}>{z}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriz.map((fila, i) => (
                  <tr key={i}>
                    <td>{sucursales[i]}</td>
                    {fila.map((val, j) => (
                      <td key={j}>Q{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>🔹 Paso 2: Reducción por Filas</h4>
            <table>
              <tbody>
                {reduccionFilas.map((fila, i) => (
                  <tr key={i}>
                    <td>{sucursales[i]}</td>
                    {fila.map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>🔹 Paso 3: Reducción por Columnas</h4>
            <table>
              <tbody>
                {reduccionColumnas.map((fila, i) => (
                  <tr key={i}>
                    <td>{sucursales[i]}</td>
                    {fila.map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>✅ Resultado Final</h4>
            <ul>
              {resultado.map((r, i) => (
                <li key={i}>
                  {r.sucursal} atiende a {r.zona} con costo mínimo Q{r.costo}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3>🚛 Método de Transporte</h3>

            <h4>🔹 Tabla de Costos</h4>
            <table>
              <thead>
                <tr>
                  <th>Origen / Destino</th>
                  {zonas.map((z, i) => (
                    <th key={i}>{z}</th>
                  ))}
                  <th>Oferta</th>
                </tr>
              </thead>

              <tbody>
                {costos.map((fila, i) => (
                  <tr key={i}>
                    <td>{sucursales[i]}</td>
                    {fila.map((v, j) => (
                      <td key={j}>Q{v}</td>
                    ))}
                    <td>{oferta[i]}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th>Demanda</th>
                  {demanda.map((d, i) => (
                    <td key={i}>{d}</td>
                  ))}
                  <td>-</td>
                </tr>
              </tfoot>
            </table>

            <h4>🔹 Asignaciones</h4>
            <table>
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Cantidad</th>
                  <th>Costo</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {asignaciones.map((a, i) => (
                  <tr key={i}>
                    <td>{a.origen}</td>
                    <td>{a.destino}</td>
                    <td>{a.cantidad}</td>
                    <td>Q{a.costo}</td>
                    <td>Q{a.cantidad * a.costo}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p><b>Costo Total:</b> Q{costoTotal}</p>

            <h4>📊 Gráfica</h4>
            <Bar data={data} />
          </div>
        </div>

        {/* ---------------- CONCLUSIÓN ---------------- */}
        <div className="panel conclusion">
          <h3>🧠 Conclusión</h3>
          <p>{conclusion}</p>
        </div>

        <button className="btn-volver" onClick={() => navigate("/pedidos")}>
          ← Volver a pedidos
        </button>
      </div>
    </div>
  );
}

export default ProcesoPedido;

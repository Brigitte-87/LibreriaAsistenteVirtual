import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./PedidosAnalisisDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function PedidosAnalisisDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("proceso");

  useEffect(() => {
    fetch("http://localhost:4000/api/pedidos")
      .then((res) => res.json())
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener pedidos:", err);
        setLoading(false);
      });
  }, []);

  const estados = ["En Proceso", "Preparando", "En Ruta", "Finalizado", "Rechazado"];
  const colores = ["#A3D2D5", "#6AA5A9", "#7EC384", "#3F7856", "#d9534f"];

  const conteoEstados = estados.map((_, i) =>
    pedidos.filter((p) => Number(p.estado) === i).length
  );

  const totalPedidos = pedidos.length;
  const totalMonto = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0);
  const promedioMonto = totalPedidos ? (totalMonto / totalPedidos).toFixed(2) : "0.00";

  const sucursales = [...new Set(pedidos.map((p) => p.sucursal).filter(Boolean))];
  const pedidosPorSucursal = sucursales.map(
    (s) => pedidos.filter((p) => p.sucursal === s).length
  );

  const dataEstados = {
    labels: estados,
    datasets: [{ label: "Pedidos por estado", data: conteoEstados, backgroundColor: colores }],
  };

  const dataSucursales = {
    labels: sucursales,
    datasets: [{ label: "Pedidos por sucursal", data: pedidosPorSucursal, backgroundColor: "#6AA5A9" }],
  };

  const ultimos = pedidos.slice(-10);
  const dataLine = {
    labels: ultimos.map((p) => `#${p.id_pedido}`),
    datasets: [
      {
        label: "Total por pedido (Q)",
        data: ultimos.map((p) => Number(p.total || 0)),
        borderColor: "#3F7856",
        backgroundColor: "rgba(63,120,86,0.18)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const sucursalesDemo = ["Zona 1", "Zona 2", "Boca del Monte"];
  const zonasDemo = ["Zona 1", "Zona 5", "Zona 16"];
  const matriz = [
    [12, 25, 30],
    [20, 10, 15],
    [18, 28, 8],
  ];

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

  const conclusion = `
El método de asignación (Húngaro) ayuda a elegir qué sucursal atiende a qué zona
al menor costo. Primero se resta el mínimo de cada fila (reducción por filas),
luego el mínimo de cada columna (reducción por columnas). Esto genera ceros que
indican combinaciones eficientes. En el ejemplo, "Boca del Monte → Zona 16" tiene
costo Q8, por eso es la mejor ruta. Esta lógica permite ahorrar tiempo y dinero
al planificar las entregas.
  `;

  const KPIs = [
    { label: "Pedidos totales", value: totalPedidos },
    { label: "Monto total", value: `Q${totalMonto.toFixed(2)}` },
    { label: "Promedio por pedido", value: `Q${promedioMonto}` },
    { label: "Sucursales activas", value: sucursales.length },
  ];

  return (
    <div className="pad-container">
      <div className="pad-bg" />
      <header className="pad-header">
        <div>
          <h1 className="pad-title">Análisis y Dashboard de Pedidos</h1>
          <p className="pad-subtitle">Vista general y explicación del proceso logístico</p>
        </div>

        <div className="pad-tabs">
          <button
            className={`pad-tab ${tab === "proceso" ? "active" : ""}`}
            onClick={() => setTab("proceso")}
          >
            Proceso logístico
          </button>
          <button
            className={`pad-tab ${tab === "dashboard" ? "active" : ""}`}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {loading ? (
        <div className="pad-loading">Cargando información...</div>
      ) : (
        <>
          {tab === "proceso" && (
            <section className="pad-card pad-process">
              <div className="pad-explain">
                <h2>¿Cómo optimizamos las entregas?</h2>
                <p>
                  El objetivo es reducir costos y tiempo de entrega. Para eso, aplicamos
                  el <b>Método de Asignación (Húngaro)</b>, que encuentra la combinación
                  sucursal–zona más eficiente.
                </p>
              </div>

              <div className="pad-grid">
                <div className="pad-panel">
                  <h3>Paso 1: Matriz de costos original</h3>
                  <table className="pad-table">
                    <thead>
                      <tr>
                        <th>Sucursal / Zona</th>
                        {zonasDemo.map((z, i) => (
                          <th key={i}>{z}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matriz.map((fila, i) => (
                        <tr key={i}>
                          <td>{sucursalesDemo[i]}</td>
                          {fila.map((v, j) => (
                            <td key={j}>Q{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>Paso 2: Reducción por filas</h3>
                  <p className="pad-note">
                    Restamos el valor más pequeño de cada fila para crear ceros que
                    nos muestran opciones de menor costo.
                  </p>
                  <table className="pad-table">
                    <tbody>
                      {reduccionFilas.map((fila, i) => (
                        <tr key={i}>
                          <td>{sucursalesDemo[i]}</td>
                          {fila.map((v, j) => (
                            <td key={j}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>Paso 3: Reducción por columnas</h3>
                  <p className="pad-note">
                    Restamos el mínimo de cada columna para equilibrar opciones entre zonas.
                  </p>
                  <table className="pad-table">
                    <tbody>
                      {reduccionColumnas.map((fila, i) => (
                        <tr key={i}>
                          <td>{sucursalesDemo[i]}</td>
                          {fila.map((v, j) => (
                            <td key={j}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>Resultado</h3>
                  <ul className="pad-result">
                    {resultado.map((r, i) => (
                      <li key={i}>
                        <b>{r.sucursal}</b> atiende <b>{r.zona}</b> con costo mínimo de <b>Q{r.costo}</b>.
                      </li>
                    ))}
                  </ul>

                  <div className="pad-conclusion">
                    <h4>Conclusión</h4>
                    <p>{conclusion}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === "dashboard" && (
            <section className="pad-card">
              <h2 className="pad-section-title">Dashboard general</h2>

              <div className="pad-kpi-grid">
                {KPIs.map((k, i) => (
                  <div key={i} className="pad-kpi">
                    <span className="pad-kpi-label">{k.label}</span>
                    <span className="pad-kpi-value">{k.value}</span>
                  </div>
                ))}
              </div>

              <div className="pad-charts">
                <div className="pad-chart">
                  <h3>Pedidos por estado</h3>
                  <Bar data={dataEstados} />
                </div>

                <div className="pad-chart">
                  <h3>Pedidos por sucursal</h3>
                  <Bar data={dataSucursales} />
                </div>

                <div className="pad-chart">
                  <h3>Evolución de totales (últimos 10)</h3>
                  <Line data={dataLine} />
                </div>

                <div className="pad-chart">
                  <h3>Distribución global</h3>
                  <Doughnut data={dataEstados} />
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

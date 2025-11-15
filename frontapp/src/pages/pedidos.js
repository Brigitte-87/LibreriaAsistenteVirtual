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
  Filler,
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
  Legend,
  Filler
);

export default function PedidosAnalisisDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.rol === "admin";

  const [authorized, setAuthorized] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");

  // ==========================
  // ¿ES ADMIN?
  // ==========================
  useEffect(() => {
    setAuthorized(isAdmin);
  }, [isAdmin]);

  // ==========================
  // FETCH SOLO SI ES ADMIN
  // ==========================
  useEffect(() => {
    if (authorized !== true) return;

    const params = new URLSearchParams({
      rol: "admin",
      dashboard: "1",
    });

    fetch(`http://localhost:4000/api/pedidos?${params}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => setPedidos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authorized]);

  if (authorized === false) {
    return (
      <div className="pad-container">
        <div className="pad-bg" />
        <div className="pad-loading">❌ No tienes permiso.</div>
      </div>
    );
  }

  if (authorized === null) {
    return (
      <div className="pad-container">
        <div className="pad-bg" />
        <div className="pad-loading">Validando...</div>
      </div>
    );
  }

  // ==========================
  // CALCULOS (SIN useMemo)
  // ==========================

  const ESTADOS = ["En Proceso", "Preparando", "En Ruta", "Finalizado", "Rechazado"];
  const COLORES_ESTADOS = ["#A3D2D5", "#6AA5A9", "#7EC384", "#3F7856", "#d9534f"];

  const totalPedidos = pedidos.length;

  const totalMonto = pedidos.reduce((a, p) => a + Number(p.total || 0), 0);

  const promedioMonto = totalPedidos ? (totalMonto / totalPedidos).toFixed(2) : "0.00";

  const sucursales = [...new Set(pedidos.map((p) => p.sucursal).filter(Boolean))];

  const pedidosPorSucursal = sucursales.map(
    (s) => pedidos.filter((p) => p.sucursal === s).length
  );

  const conteoEstados = ESTADOS.map((_, i) =>
    pedidos.filter((p) => Number(p.estado) === i).length
  );

  const ultimosPedidos = pedidos.slice(-10);

  // Pedidos por mensajero
  const pedidosPorMensajero = {};
  pedidos.forEach((p) => {
    const key = p.mensajero || "Sin asignar";
    pedidosPorMensajero[key] = (pedidosPorMensajero[key] || 0) + 1;
  });

  // Rutas más solicitadas
  const rutasMasSolicitadas = {};
  pedidos.forEach((p) => {
    const k = p.sucursal || "Sin sucursal";
    rutasMasSolicitadas[k] = (rutasMasSolicitadas[k] || 0) + 1;
  });

  // Tarifa de envío stats
  const tarifas = pedidos.map((p) => Number(p.tarifa_envio || 0));
  const tarifaStats =
    tarifas.length === 0
      ? null
      : {
          promedio: (tarifas.reduce((a, b) => a + b, 0) / tarifas.length).toFixed(2),
          max: Math.max(...tarifas),
          min: Math.min(...tarifas),
          tarifaMasComun: Object.keys(
            tarifas.reduce((map, v) => {
              map[v] = (map[v] || 0) + 1;
              return map;
            }, {})
          ).sort(
            (a, b) =>
              tarifas.filter((x) => x == b).length -
              tarifas.filter((x) => x == a).length
          )[0],
        };

  // Gráficas construidas sin useMemo
  const dataEstados = {
    labels: ESTADOS,
    datasets: [{ label: "Pedidos por estado", data: conteoEstados, backgroundColor: COLORES_ESTADOS }],
  };

  const dataSucursales = {
    labels: sucursales,
    datasets: [{ label: "Pedidos por sucursal", data: pedidosPorSucursal, backgroundColor: "#6AA5A9" }],
  };

  const dataMensajeros = {
    labels: Object.keys(pedidosPorMensajero),
    datasets: [
      {
        label: "Pedidos por mensajero",
        data: Object.values(pedidosPorMensajero),
        backgroundColor: "#7EC384",
      },
    ],
  };

  const dataLine = {
    labels: ultimosPedidos.map((p) => `#${p.id_pedido}`),
    datasets: [
      {
        label: "Total por pedido",
        data: ultimosPedidos.map((p) => Number(p.total || 0)),
        borderColor: "#3F7856",
        backgroundColor: "rgba(63,120,86,0.18)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const dataRutas = {
    labels: Object.keys(rutasMasSolicitadas),
    datasets: [
      {
        label: "Pedidos",
        data: Object.values(rutasMasSolicitadas),
        backgroundColor: "#A3D2D5",
      },
    ],
  };

  // ==========================
  // RENDER PRINCIPAL
  // ==========================
  return (
    <div className="pad-container">
      <div className="pad-bg" />

      <header className="pad-header">
        <div>
          <h1 className="pad-title">Dashboard Logístico</h1>
          <p className="pad-subtitle">Métricas avanzadas de pedidos y rutas</p>
        </div>

        <div className="pad-tabs">
          {[
            { id: "dashboard", nombre: "Dashboard" },
            { id: "proceso", nombre: "Proceso logístico" },
          ].map((t) => (
            <button
              key={t.id}
              className={`pad-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.nombre}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="pad-loading">Cargando datos...</div>
      ) : (
        <>
          {/* ================= DASHBOARD ================= */}
          {tab === "dashboard" && (
            <section className="pad-card">

              {/* KPIs */}
              <div className="pad-kpi-grid">
                <KPI label="Pedidos totales" value={totalPedidos} />
                <KPI label="Monto total" value={`Q${totalMonto.toFixed(2)}`} />
                <KPI label="Promedio pedido" value={`Q${promedioMonto}`} />
                <KPI label="Sucursales activas" value={sucursales.length} />

                <KPI
                  label="Mensajero más activo"
                  value={
                    Object.entries(pedidosPorMensajero).sort((a, b) => b[1] - a[1])[0]
                      ? Object.entries(pedidosPorMensajero).sort((a, b) => b[1] - a[1])[0][0]
                      : "N/A"
                  }
                />

                <KPI
                  label="Sucursal más solicitada"
                  value={
                    Object.entries(rutasMasSolicitadas).sort((a, b) => b[1] - a[1])[0]
                      ? Object.entries(rutasMasSolicitadas).sort((a, b) => b[1] - a[1])[0][0]
                      : "N/A"
                  }
                />

                <KPI
                  label="Tarifa más común"
                  value={tarifaStats ? `Q${tarifaStats.tarifaMasComun}` : "N/A"}
                />
              </div>

              {/* GRAFICAS */}
              <div className="pad-charts">

                <ChartBox title="Pedidos por estado">
                  <Bar data={dataEstados} />
                </ChartBox>

                <ChartBox title="Pedidos por sucursal">
                  <Bar data={dataSucursales} />
                </ChartBox>

                <ChartBox title="Pedidos por mensajero">
                  <Bar data={dataMensajeros} />
                </ChartBox>

                <ChartBox title="Rutas más solicitadas">
                  <Bar data={dataRutas} />
                </ChartBox>

                <ChartBox title="Últimos 10 pedidos">
                  <Line data={dataLine} />
                </ChartBox>

                <ChartBox title="Distribución general">
                  <Doughnut data={dataEstados} />
                </ChartBox>

                <ChartBox title="Tarifas">
                  {tarifaStats && (
                    <ul className="pad-result">
                      <li><b>Más común:</b> Q{tarifaStats.tarifaMasComun}</li>
                      <li><b>Promedio:</b> Q{tarifaStats.promedio}</li>
                      <li><b>Máxima:</b> Q{tarifaStats.max}</li>
                      <li><b>Mínima:</b> Q{tarifaStats.min}</li>
                    </ul>
                  )}
                </ChartBox>

              </div>
            </section>
          )}

          {/* ================= PROCESO LOGÍSTICO ================= */}
          {tab === "proceso" && (
            <section className="pad-card">
              <ProcesoHungaro />
            </section>
          )}
        </>
      )}
    </div>
  );
}

/* ===== COMPONENTES ===== */

function KPI({ label, value }) {
  return (
    <div className="pad-kpi">
      <span className="pad-kpi-label">{label}</span>
      <span className="pad-kpi-value">{value}</span>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="pad-chart">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/* ----- MÉTODO HÚNGARO (tu sección original) ----- */
function ProcesoHungaro() {
  const sucursalesDemo = ["Zona 1", "Zona 2", "Boca del Monte"];
  const zonasDemo = ["Zona 1", "Zona 5", "Zona 16"];
  const matriz = [
    [12, 25, 30],
    [20, 10, 15],
    [18, 28, 8],
  ];

  const reduccionFilas = matriz.map((fila) => {
    const m = Math.min(...fila);
    return fila.map((v) => v - m);
  });

  const minCol = reduccionFilas[0].map((_, col) =>
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
El método Húngaro ayuda a encontrar la mejor asignación sucursal → zona reduciendo
costos. "Boca del Monte → Zona 16" tiene el costo más bajo (Q8), por eso es la mejor opción.
`;

  return (
    <div className="pad-panel">
      <h3>Paso 1: Matriz de costos</h3>
      <TablaCostos filas={matriz} filasTit={sucursalesDemo} colsTit={zonasDemo} />

      <h3>Paso 2: Reducción por filas</h3>
      <TablaCostos filas={reduccionFilas} filasTit={sucursalesDemo} />

      <h3>Paso 3: Reducción por columnas</h3>
      <TablaCostos filas={reduccionColumnas} filasTit={sucursalesDemo} />

      <h3>Resultado</h3>
      <ul className="pad-result">
        {resultado.map((r, i) => (
          <li key={i}>
            <b>{r.sucursal}</b> atiende <b>{r.zona}</b> con costo <b>Q{r.costo}</b>.
          </li>
        ))}
      </ul>

      <div className="pad-conclusion">
        <h4>Conclusión</h4>
        <p>{conclusion}</p>
      </div>
    </div>
  );
}

function TablaCostos({ filas, filasTit, colsTit }) {
  return (
    <table className="pad-table">
      {colsTit && (
        <thead>
          <tr>
            <th>Sucursal / Zona</th>
            {colsTit.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {filas.map((fila, i) => (
          <tr key={i}>
            <td>{filasTit[i]}</td>
            {fila.map((v, j) => (
              <td key={j}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

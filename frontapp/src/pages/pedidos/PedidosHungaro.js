import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../PedidosAnalisisDashboard.css";

export default function MetodoHungaro() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.rol === "admin";

  const [authorized, setAuthorized] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthorized(isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (authorized !== true) return;

    const params = new URLSearchParams({
      rol: "admin",
      dashboard: "1",
    });

    fetch(`http://localhost:4000/api/pedidos?${params}`)
      .then((r) => r.json())
      .then((data) => setPedidos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authorized]);

  if (authorized === false) {
    return (
      <div className="pad-container">
        <div className="pad-bg" />
        <div className="pad-loading">No tienes permiso.</div>
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

  function distanciaKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const sucursalesMap = {};
  pedidos.forEach((p) => {
    if (p.id_sucursal && p.sucursal_lat != null && p.sucursal_lng != null) {
      const id = p.id_sucursal;
      if (!sucursalesMap[id]) {
        sucursalesMap[id] = {
          id: p.id_sucursal,
          nombre: p.sucursal,
          lat: Number(p.sucursal_lat),
          lng: Number(p.sucursal_lng),
        };
      }
    }
  });
  const sucursales = Object.values(sucursalesMap);

  const zonasMap = {};
  pedidos.forEach((p) => {
    if (!p.zona || p.lat == null || p.lng == null) return;
    const z = String(p.zona).trim();
    if (!z) return;

    if (!zonasMap[z]) zonasMap[z] = { latSum: 0, lngSum: 0, count: 0 };

    zonasMap[z].latSum += Number(p.lat);
    zonasMap[z].lngSum += Number(p.lng);
    zonasMap[z].count += 1;
  });

  const zonas = Object.keys(zonasMap)
    .map((z) => ({
      zona: z,
      lat: zonasMap[z].latSum / zonasMap[z].count,
      lng: zonasMap[z].lngSum / zonasMap[z].count,
    }))
    .sort((a, b) => Number(a.zona) - Number(b.zona));

  const sucursalesTitulos = sucursales.map((s) => s.nombre);
  const zonasTitulos = zonas.map((z) => `Zona ${z.zona}`);

  const matriz = sucursales.map((s) =>
    zonas.map((z) => Number(distanciaKm(s.lat, s.lng, z.lat, z.lng).toFixed(2)))
  );

  const reduccionFilas = matriz.map((fila) => {
    const min = Math.min(...fila);
    return fila.map((v) => Number((v - min).toFixed(2)));
  });

  const minCol = zonas.map((_, j) =>
    Math.min(...reduccionFilas.map((fila) => fila[j]))
  );

  const reduccionColumnas = reduccionFilas.map((fila) =>
    fila.map((v, j) => Number((v - minCol[j]).toFixed(2)))
  );

  const asignaciones = [];
  const usadasSuc = new Set();
  const usadasZona = new Set();

  while (usadasSuc.size < sucursales.length && usadasZona.size < zonas.length) {
    let mejor = null;

    for (let i = 0; i < sucursales.length; i++) {
      if (usadasSuc.has(i)) continue;
      for (let j = 0; j < zonas.length; j++) {
        if (usadasZona.has(j)) continue;
        const costo = matriz[i][j];
        if (!mejor || costo < mejor.costo) {
          mejor = { i, j, costo };
        }
      }
    }

    if (!mejor) break;

    usadasSuc.add(mejor.i);
    usadasZona.add(mejor.j);

    asignaciones.push({
      sucursal: sucursales[mejor.i].nombre,
      zona: zonas[mejor.j].zona,
      costo: Number(mejor.costo.toFixed(2)),
    });
  }

  const costoTotal = asignaciones.reduce((s, a) => s + a.costo, 0);

  const hayDatos =
    sucursales.length > 0 &&
    zonas.length > 0 &&
    matriz.length > 0 &&
    matriz[0].length > 0;

  return (
    <div className="pad-container">
      <div className="pad-bg" />

      <header className="pad-header">
        <div>
          <h1 className="pad-title">Método Húngaro (Optimización Real)</h1>
          <p className="pad-subtitle">
            Cálculo basado en distancias reales entre sucursales y zonas detectadas en pedidos.
          </p>
        </div>

        <button
          onClick={() => navigate("/pedidos/dashboard")}
          className="pad-tab active"
          style={{ marginLeft: "auto" }}
        >
          Volver al Dashboard
        </button>
      </header>

      {loading ? (
        <div className="pad-loading">Cargando datos...</div>
      ) : !hayDatos ? (
        <div className="pad-loading">
          No hay suficientes pedidos con zona y coordenadas para construir el análisis.
        </div>
      ) : (
        <section className="pad-card">
          <div className="pad-panel">

            <h3>Paso 1  Matriz de costos (distancia en km)</h3>
            <p className="pad-description">
              En esta tabla cada fila representa una <b>sucursal</b> y cada columna una <b>zona</b>.
              El valor indica la distancia real en kilómetros entre la sucursal y el centro aproximado
              de esa zona, calculado a partir de los pedidos registrados.
            </p>

            <TablaCostos filas={matriz} filasTit={sucursalesTitulos} colsTit={zonasTitulos} />

            <h3>Paso 2 Reducción por filas</h3>
            <p className="pad-description">
              Al restar el valor mínimo de cada fila, normalizamos los costos por sucursal.
              Esto permite comparar sucursales entre sí eliminando su “sesgo de distancia”.
              Aquí se preparan las condiciones para encontrar asignaciones óptimas.
            </p>

            <TablaCostos filas={reduccionFilas} filasTit={sucursalesTitulos} />

            <h3>Paso 3 Reducción por columnas</h3>
            <p className="pad-description">
              Ahora se resta el mínimo de cada columna.  
              Esta reducción asegura que en cada zona exista al menos un valor cero,  
              lo cual representa una opción “óptima” disponible para asignación.
            </p>

            <TablaCostos filas={reduccionColumnas} filasTit={sucursalesTitulos} />

            <h3>Asignaciones sugeridas (resultado)</h3>
            <p className="pad-description">
              La siguiente asignación indica qué sucursal debería atender cada zona para minimizar la distancia total.  
              Se recorren los costos reducidos buscando los emparejamientos más eficientes.
            </p>

            <ul className="pad-result">
              {asignaciones.map((a, i) => (
                <li key={i}>
                  <b>{a.sucursal}</b> → <b>Zona {a.zona}</b>  
                  <span style={{ color: "#3F7856" }}> ({a.costo} km)</span>
                </li>
              ))}
            </ul>

            <div className="pad-conclusion">
              <h4>Conclusión general</h4>
              <p>
                El método Húngaro aplicado con datos reales permite identificar qué sucursal minimiza los
                tiempos y distancias de entrega para cada zona de la ciudad. Esto es clave para asignaciones
                logísticas, rutas estratégicas y reducción de costos operativos.
              </p>

              <p>
                <b>Costo total aproximado de la asignación:</b> {costoTotal.toFixed(2)} km
              </p>
            </div>
          </div>
        </section>
      )}
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

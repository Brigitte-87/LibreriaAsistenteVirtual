import React from "react";
import { useNavigate } from "react-router-dom";
import { usePedidosLogic } from "./pedidosLogic";
import { ui, estadoColor, textoEstado, iconoEstado, progressColor } from "./pedidosUI";

function Pedidos() {
  const navigate = useNavigate();
  const {
    pedidosFiltrados,
    loading,
    kpis,
    filtroEstado,
    search,
    mensajeros,
    pedidoSeleccionado,
    mensajeroSeleccionado,
    setFiltroEstado,
    setSearch,
    setPedidoSeleccionado,
    setMensajeroSeleccionado,
    cambiarEstado,
  } = usePedidosLogic();

  const [currentPage, setCurrentPage] = React.useState(1);
  const pedidosPorPagina = 20;

  const totalPages = Math.ceil(
    Math.min(pedidosFiltrados.length, 100) / pedidosPorPagina
  );

  const paginatedPedidos = pedidosFiltrados
    .slice(0, 100)
    .slice((currentPage - 1) * pedidosPorPagina, currentPage * pedidosPorPagina);

  return (
    <div style={ui.layout}>
      <div style={ui.bgGlow} />

      <header style={ui.header}>
        <div style={ui.headerTop}>
          <h1 style={ui.title}>Gestión de Pedidos</h1>
          <div style={ui.searchWrap}>
            <input
              placeholder="Buscar por ID, cliente, sucursal o mensajero..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={ui.search}
            />
          </div>
        </div>
        <p style={ui.subtitle}>Control total del flujo de entregas</p>

        <div style={ui.kpis}>
          {[
            { label: "Total", value: kpis.total, style: ui.kpiTotal },
            { label: "En Proceso", value: kpis.e0, style: ui.kpiE0 },
            { label: "Preparando", value: kpis.e1, style: ui.kpiE1 },
            { label: "En Ruta", value: kpis.e2, style: ui.kpiE2 },
            { label: "Finalizado", value: kpis.e3, style: ui.kpiE3 },
          ].map((item, i) => (
            <div key={i} style={{ ...ui.kpi, ...item.style }}>
              <div style={ui.kpiLabel}>{item.label}</div>
              <div style={ui.kpiValue}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={ui.tabs}>
          {[
            { key: "todos", label: "Todos" },
            { key: 0, label: "En Proceso" },
            { key: 1, label: "Preparando" },
            { key: 2, label: "En Ruta" },
            { key: 3, label: "Finalizado" },
            { key: 4, label: "Rechazado" },
          ].map((t) => (
            <button
              key={String(t.key)}
              onClick={() => setFiltroEstado(t.key)}
              style={{
                ...ui.tab,
                ...(String(filtroEstado) === String(t.key) ? ui.tabActive : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ ...ui.card, ...ui.scrollContainer }}>
        {loading ? (
          <div style={ui.empty}>Cargando pedidos...</div>
        ) : pedidosFiltrados.length === 0 ? (
          <div style={ui.empty}>Sin resultados.</div>
        ) : (
          <>
            <div style={ui.tableWrapper}>
              <table style={ui.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Sucursal</th>
                    <th>Mensajero</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Progreso</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPedidos.map((p) => (
                    <tr key={p.id_pedido} style={ui.row}>
                      <td style={ui.idCell}>#{p.id_pedido}</td>
                      <td>{p.cliente}</td>
                      <td>{p.sucursal}</td>
                      <td>{p.mensajero || "—"}</td>
                      <td>Q{Number(p.total || 0).toFixed(2)}</td>
                      <td>
                        <span style={{ ...ui.status, ...estadoColor(p.estado) }}>
                          {iconoEstado(p.estado)} {textoEstado(p.estado)}
                        </span>
                      </td>
                      <td>
                        <div style={ui.progressTrack}>
                          <div
                            style={{
                              ...ui.progressFill,
                              width: `${(Number(p.estado) / 4) * 100}%`,
                              ...progressColor(p.estado),
                            }}
                          />
                        </div>
                      </td>
                      <td>{p.fecha}</td>
                      <td style={ui.actions}>
                        {Number(p.estado) === 0 && (
                          <>
                            <button
                              title="Preparar"
                              style={{ ...ui.iconBtn, ...ui.btnPrimary }}
                              onClick={() => cambiarEstado(p.id_pedido, 1)}
                            >
                              ▶
                            </button>
                            <button
                              title="Rechazar pedido"
                              style={{ ...ui.iconBtn, ...ui.btnDanger }}
                              onClick={() => cambiarEstado(p.id_pedido, 4)}
                            >
                              ✖
                            </button>
                          </>
                        )}

                        {Number(p.estado) === 1 && (
                          <button
                            title="Asignar ruta"
                            style={{ ...ui.iconBtn, ...ui.btnCyan }}
                            onClick={() => setPedidoSeleccionado(p)}
                          >
                            ⇢
                          </button>
                        )}

                        {Number(p.estado) === 2 && (
                          <button
                            title="Finalizar"
                            style={{ ...ui.iconBtn, ...ui.btnSuccess }}
                            onClick={() => cambiarEstado(p.id_pedido, 3)}
                          >
                            ✔
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={ui.pagination}>
              <button
                style={{
                  ...ui.pageBtn,
                  ...(currentPage === 1 ? ui.pageBtnDisabled : {}),
                }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Anterior
              </button>

              <span style={ui.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>

              <button
                style={{
                  ...ui.pageBtn,
                  ...(currentPage === totalPages ? ui.pageBtnDisabled : {}),
                }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </main>

      {pedidoSeleccionado && (
        <div style={ui.overlay}>
          <div style={ui.modal}>
            <h2 style={ui.modalTitle}>
              Asignar mensajero — Pedido #{pedidoSeleccionado.id_pedido}
            </h2>

            <select
              value={mensajeroSeleccionado}
              onChange={(e) => setMensajeroSeleccionado(e.target.value)}
              style={ui.select}
            >
              <option value="">Seleccione un mensajero</option>
              {mensajeros.map((m) => (
                <option key={m.id_mensajero} value={m.id_mensajero}>
                  {m.nombre}
                </option>
              ))}
            </select>

            <div style={ui.modalActions}>
              <button
                style={{ ...ui.button, ...ui.cyan }}
                disabled={!mensajeroSeleccionado}
                onClick={() =>
                  cambiarEstado(
                    pedidoSeleccionado.id_pedido,
                    2,
                    mensajeroSeleccionado
                  )
                }
              >
                Confirmar
              </button>
              <button
                style={{ ...ui.button, ...ui.danger }}
                onClick={() => {
                  setPedidoSeleccionado(null);
                  setMensajeroSeleccionado("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;

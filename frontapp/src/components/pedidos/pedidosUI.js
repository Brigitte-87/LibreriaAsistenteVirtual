export const ui = {
  layout: {
    fontFamily: "Poppins, Inter, system-ui, sans-serif",
    background:
      "radial-gradient(1200px 800px at -10% -10%, rgba(163,210,213,0.6), transparent 60%), radial-gradient(900px 600px at 110% 10%, rgba(106,165,169,0.5), transparent 60%), linear-gradient(145deg, #A3D2D5 0%, #6AA5A9 45%, #3F7856 100%)",
    minHeight: "100vh",
    padding: "56px 64px",
    color: "#0f172a",
    position: "relative",
    overflowX: "hidden",
  },

  bgGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(800px 400px at 20% 0%, rgba(255,255,255,0.25), transparent 50%)",
    pointerEvents: "none",
  },

  header: {
    background: "rgba(255, 255, 255, 0.16)",
    backdropFilter: "blur(14px)",
    padding: "26px 32px",
    borderRadius: 18,
    marginBottom: 28,
    boxShadow: "0 15px 50px rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,255,255,0.28)",
  },

  headerTop: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 30,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "0.2px",
  },

  subtitle: {
    fontSize: 14,
    color: "#183b3b",
    marginTop: 8,
  },

  searchWrap: { minWidth: 320, maxWidth: 520, width: "35%" },

  search: {
    width: "90%",
    height: 40,
    borderRadius: 12,
    padding: "0 14px",
    border: "1px solid rgba(255,255,255,0.45)",
    outline: "none",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(6px)",
    fontSize: 14,
  },

  kpis: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  kpi: {
    borderRadius: 14,
    padding: "14px 16px",
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.35)",
    boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  },
  kpiLabel: { fontSize: 12, opacity: 0.7, marginBottom: 6 },
  kpiValue: { fontSize: 22, fontWeight: 800 },
  kpiTotal: { background: "rgba(255,255,255,0.45)" },
  kpiE0: { background: "rgba(163,210,213,0.45)" },
  kpiE1: { background: "rgba(106,165,169,0.45)" },
  kpiE2: { background: "rgba(126,195,132,0.45)" },
  kpiE3: { background: "rgba(63,120,86,0.35)" },

  tabs: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" },
  tab: {
    padding: "8px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.35)",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  tabActive: {
    background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)",
    color: "#073030",
  },

  card: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(18px)",
    borderRadius: 18,
    boxShadow: "0 12px 50px rgba(0,0,0,0.12)",
    padding: "18px 24px",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    fontSize: 14,
    color: "#0f172a",
  },
  row: {
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  idCell: { fontWeight: 700 },
  empty: { textAlign: "center", padding: 50, color: "#183b3b" },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minWidth: 160,
    justifyContent: "center",
    borderRadius: 999,
    padding: "8px 12px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },

  progressTrack: {
    width: 160,
    height: 10,
    borderRadius: 999,
    background: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 420ms ease",
  },

  actions: { display: "flex", gap: 8, justifyContent: "center" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontSize: 16,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
    transition: "transform .12s ease, box-shadow .2s ease",
  },
  btnPrimary: { background: "linear-gradient(135deg, #7EC384, #3F7856)" },
  btnCyan: { background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)" },
  btnSuccess: { background: "linear-gradient(135deg, #3F7856, #7EC384)" },
  btnDark: { background: "linear-gradient(135deg, #45625D, #3F7856)" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "rgba(255,255,255,0.98)",
    borderRadius: 18,
    width: 460,
    padding: 28,
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1b3e3b",
    marginBottom: 18,
  },
  select: {
    width: "100%",
    height: 42,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid #6AA5A9",
    marginBottom: 16,
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },
  modalActions: { display: "flex", justifyContent: "center", gap: 10 },

  button: {
    border: "none",
    borderRadius: 12,
    padding: "10px 16px",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cyan: {
    background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)",
    boxShadow: "0 4px 12px rgba(106,165,169,0.4)",
  },
  danger: {
    background: "linear-gradient(135deg, #d9534f, #b91c1c)",
    color: "#fff",
  },

  scrollContainer: {
    maxHeight: "700px",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowY: "auto",
    maxHeight: "500px",
    scrollbarWidth: "thin",
    scrollbarColor: "#A3D2D5 transparent",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingTop: 18,
  },
  pageBtn: {
    border: "none",
    background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)",
    color: "#fff",
    fontWeight: 600,
    borderRadius: 10,
    padding: "8px 14px",
    cursor: "pointer",
    transition: "opacity 0.2s ease, transform 0.1s ease",
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: 600,
    background: "rgba(255,255,255,0.6)",
    borderRadius: 8,
    padding: "6px 12px",
  },
};

export function estadoColor(estado) {
  switch (Number(estado)) {
    case 0:
      return { background: "#A3D2D5", color: "#0b2230", border: "1px solid #85c4ca" };
    case 1:
      return { background: "#6AA5A9", color: "#ffffff", border: "1px solid #5a9296" };
    case 2:
      return { background: "#7EC384", color: "#0b2230", border: "1px solid #6db376" };
    case 3:
      return { background: "#3F7856", color: "#ffffff", border: "1px solid #3a6c4f" };
    default:
      return { background: "#e2e8f0", color: "#334155" };
  }
}

export function textoEstado(estado) {
  switch (Number(estado)) {
    case 0:
      return "En Proceso";
    case 1:
      return "Preparando Pedido";
    case 2:
      return "En Ruta";
    case 3:
      return "Finalizado";
    default:
      return "Desconocido";
  }
}

export function iconoEstado(estado) {
  switch (Number(estado)) {
    case 0:
      return "⚙"; 
    case 1:
      return "⧉"; 
    case 2:
      return "➔"; 
    case 3:
      return "✔"; 
    default:
      return "?";
  }
}

export function progressColor(estado) {
  switch (Number(estado)) {
    case 0:
      return { background: "linear-gradient(90deg, #A3D2D5, #6AA5A9)" };
    case 1:
      return { background: "linear-gradient(90deg, #6AA5A9, #7EC384)" };
    case 2:
      return { background: "linear-gradient(90deg, #7EC384, #3F7856)" };
    case 3:
      return { background: "linear-gradient(90deg, #3F7856, #3F7856)" };
    default:
      return { background: "linear-gradient(90deg, #e2e8f0, #cbd5e1)" };
  }
}

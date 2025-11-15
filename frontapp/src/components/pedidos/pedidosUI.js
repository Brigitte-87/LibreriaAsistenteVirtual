export const ui = {
  layout: {
    fontFamily: "Poppins, Inter, system-ui, sans-serif",
    background: `
      radial-gradient(1200px 800px at -10% -10%, rgba(163,210,213,0.6), transparent 60%),
      radial-gradient(900px 600px at 110% 10%, rgba(106,165,169,0.5), transparent 60%),
      linear-gradient(145deg, #A3D2D5 0%, #6AA5A9 45%, #3F7856 100%)
    `,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    padding: 0,         
    overflow: "hidden",
    position: "relative",
  },

  bgGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(800px 400px at 20% 0%, rgba(255,255,255,0.25), transparent 50%)",
    pointerEvents: "none",
  },
  
  header: {
    background: "rgba(255, 255, 255, 0.18)",
    backdropFilter: "blur(14px)",
    padding: "22px 32px",
    borderRadius: 0,
    boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
    borderBottom: "1px solid rgba(255,255,255,0.35)",
  },

  headerTop: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
  },

  subtitle: {
    fontSize: 13,
    color: "#183b3b",
    marginTop: 8,
  },

  searchWrap: {
    minWidth: 280,
    maxWidth: 500,
    width: "40%",
  },

  search: {
    width: "90%",
    height: 38,
    borderRadius: 10,
    padding: "0 14px",
    border: "1px solid rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.65)",
    outline: "none",
    fontSize: 14,
  },

  kpis: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 10,
    marginTop: 14,
  },

  kpi: {
    borderRadius: 14,
    padding: "10px 12px",
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.28)",
    boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  },

  kpiLabel: { fontSize: 11, opacity: 0.7, marginBottom: 4 },
  kpiValue: { fontSize: 20, fontWeight: 800 },

  kpiTotal: { background: "rgba(255,255,255,0.45)" },
  kpiE0: { background: "rgba(163,210,213,0.45)" },
  kpiE1: { background: "rgba(106,165,169,0.45)" },
  kpiE2: { background: "rgba(126,195,132,0.45)" },
  kpiE3: { background: "rgba(63,120,86,0.35)" },

  tabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 14,
  },

  tab: {
    padding: "6px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.35)",
    cursor: "pointer",
    fontWeight: 600,
  },

  tabActive: {
    background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)",
    color: "#073030",
  },

  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  },

  card: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.20)",
    backdropFilter: "blur(18px)",
    padding: "18px 24px",
    borderRadius: "18px 18px 0 0",
    overflow: "hidden",
  },

  tableWrapper: {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
    maxHeight: "100%",
    scrollbarWidth: "thin",
    scrollbarColor: "#A3D2D5 transparent",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    fontSize: 14,
  },

  row: {
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },

  idCell: { fontWeight: 700 },

  empty: {
    textAlign: "center",
    padding: 50,
    color: "#183b3b",
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "6px 10px",
    fontWeight: 700,
    borderRadius: 999,
    minWidth: 130,
  },

  progressTrack: {
    width: 130,
    height: 10,
    borderRadius: 999,
    background: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width .4s ease",
  },

  actions: { display: "flex", gap: 8, justifyContent: "center" },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontSize: 16,
    display: "grid",
    placeItems: "center",
  },

  btnPrimary: { background: "linear-gradient(135deg, #7EC384, #3F7856)" },
  btnCyan: { background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)" },
  btnSuccess: { background: "linear-gradient(135deg, #3F7856, #7EC384)" },
  btnDanger: { background: "linear-gradient(135deg, #d9534f, #b91c1c)" },

  pagination: {
    paddingTop: 14,
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },

  pageBtn: {
    padding: "6px 12px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  pageBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  pageInfo: {
    padding: "4px 10px",
    background: "rgba(255,255,255,0.6)",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: 420,
    background: "#fff",
    borderRadius: 14,
    padding: 26,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 14,
  },

  select: {
    width: "100%",
    height: 40,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid #6AA5A9",
    marginBottom: 16,
  },

  modalActions: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },

  button: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
  },

  logoutBtn: {
  background: "rgba(255,255,255,0.20)",
  border: "1px solid rgba(255,255,255,0.45)",
  padding: "8px 16px",
  borderRadius: 12,
  color: "#073030",
  fontWeight: 700,
  backdropFilter: "blur(6px)",
  cursor: "pointer",
  transition: "0.25s ease",
  fontSize: 14,
},


  cyan: {
    background: "linear-gradient(135deg, #6AA5A9, #A3D2D5)",
  },

  danger: {
    background: "linear-gradient(135deg, #d9534f, #b91c1c)",
  },
};

export function estadoColor(estado) {
  switch (Number(estado)) {
    case 0:
      return { background: "#A3D2D5", color: "#0b2230" };
    case 1:
      return { background: "#6AA5A9", color: "#ffffff" };
    case 2:
      return { background: "#7EC384", color: "#0b2230" };
    case 3:
      return { background: "#3F7856", color: "#ffffff" };
    case 4:
      return { background: "#d9534f", color: "#ffffff" };
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
    case 4:
      return "Rechazado";
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
    case 4:
      return "✖";
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
      return { background: "#cbd5e1" };
  }
}

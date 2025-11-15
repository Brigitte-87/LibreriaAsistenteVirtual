import { useEffect, useMemo, useState } from "react";

export function usePedidosLogic() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeros, setMensajeros] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mensajeroSeleccionado, setMensajeroSeleccionado] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const cargarPedidos = async () => {
    try {
      const params = new URLSearchParams({
        rol: user.rol,
        sucursal_id: user.sucursal_id,
      });

      const res = await fetch(`http://localhost:4000/api/pedidos?${params}`);
      const data = await res.json();
      setPedidos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const cargarMensajeros = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/mensajeros");
      const data = await res.json();
      setMensajeros(data);
    } catch (err) {
      console.error("Error cargando mensajeros:", err);
    }
  };

  useEffect(() => {
    cargarPedidos();
    cargarMensajeros();
    const timer = setInterval(() => cargarPedidos(), 6000);
    return () => clearInterval(timer);
  }, []);

  const cambiarEstado = async (id_pedido, estado, id_mensajero = null) => {
    try {
      await fetch(`http://localhost:4000/api/pedidos/${id_pedido}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, id_mensajero }),
      });
      cargarPedidos();
      setPedidoSeleccionado(null);
      setMensajeroSeleccionado("");
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  const kpis = useMemo(() => {
    return {
      total: pedidos.length,
      e0: pedidos.filter((p) => Number(p.estado) === 0).length,
      e1: pedidos.filter((p) => Number(p.estado) === 1).length,
      e2: pedidos.filter((p) => Number(p.estado) === 2).length,
      e3: pedidos.filter((p) => Number(p.estado) === 3).length,
    };
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    let data = [...pedidos];

    if (filtroEstado !== "todos") {
      data = data.filter((p) => Number(p.estado) === Number(filtroEstado));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          String(p.id_pedido).includes(q) ||
          (p.cliente || "").toLowerCase().includes(q) ||
          (p.sucursal || "").toLowerCase().includes(q) ||
          (p.mensajero || "").toLowerCase().includes(q)
      );
    }

    return data;
  }, [pedidos, filtroEstado, search]);

  return {
    pedidosFiltrados,
    pedidos,
    loading,
    kpis,
    mensajeros,
    pedidoSeleccionado,
    mensajeroSeleccionado,
    filtroEstado,
    search,
    setFiltroEstado,
    setSearch,
    setPedidoSeleccionado,
    setMensajeroSeleccionado,
    cambiarEstado,
  };
}

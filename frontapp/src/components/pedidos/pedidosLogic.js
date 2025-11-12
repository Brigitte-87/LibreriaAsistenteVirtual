import { useEffect, useMemo, useState } from "react";

export function usePedidosLogic() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeros, setMensajeros] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mensajeroSeleccionado, setMensajeroSeleccionado] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [search, setSearch] = useState("");

  const cargarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pedidos");
      const data = await res.json();
      setPedidos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setLoading(false);
    }
  };


    const cargarMensajeros = async () => {
    try {
        const res = await fetch("http://localhost:4000/api/mensajeros");
        const data = await res.json();
        setMensajeros(data);
    } catch (error) {
        console.error("Error al obtener mensajeros:", error);
    }
    };

  useEffect(() => {
    cargarPedidos();
    cargarMensajeros();
    const intervalo = setInterval(cargarPedidos, 6000);
    return () => clearInterval(intervalo);
  }, []);

  const cambiarEstado = async (id_pedido, nuevoEstado, id_mensajero = null) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/pedidos/${id_pedido}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado, id_mensajero }),
        }
      );
      await res.json();
      await cargarPedidos();
      setPedidoSeleccionado(null);
      setMensajeroSeleccionado("");
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
    }
  };

  const kpis = useMemo(() => {
    const total = pedidos.length;
    const e0 = pedidos.filter((p) => Number(p.estado) === 0).length;
    const e1 = pedidos.filter((p) => Number(p.estado) === 1).length;
    const e2 = pedidos.filter((p) => Number(p.estado) === 2).length;
    const e3 = pedidos.filter((p) => Number(p.estado) === 3).length;
    return { total, e0, e1, e2, e3 };
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

    pedidos,
    loading,
    mensajeros,
    pedidoSeleccionado,
    mensajeroSeleccionado,
    filtroEstado,
    search,

    kpis,
    pedidosFiltrados,

    setFiltroEstado,
    setSearch,

    setPedidoSeleccionado,
    setMensajeroSeleccionado,

    cargarPedidos,
    cargarMensajeros,
    cambiarEstado,
  };
}

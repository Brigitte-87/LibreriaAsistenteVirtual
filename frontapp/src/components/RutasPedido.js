import React, { useEffect, useState } from "react";

function RutasPedido({ idPedido }) {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`http://localhost:4000/api/pedidos/${idPedido}/rutas`);
        const data = await res.json();
        setRutas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setRutas([]);
      }
      setLoading(false);
    }

    cargar();
  }, [idPedido]);

  if (loading) return <p>Cargando rutas...</p>;
  if (!rutas.length) return <p>No hay rutas generadas.</p>;

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Ruta</th>
          <th>Distancia (km)</th>
          <th>Duración (min)</th>
        </tr>
      </thead>

      <tbody>
        {rutas.map((r, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{Number(r.distancia_km).toFixed(2)}</td>
            <td>{r.duracion_min}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RutasPedido;

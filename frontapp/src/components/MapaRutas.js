import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";

const iconSucursal = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const iconCliente = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [32, 32],
});

export default function MapaRutas({ idPedido }) {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`http://localhost:4000/api/pedidos/${idPedido}/rutas`);
        const data = await res.json();
        setRutas(data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    cargar();
  }, [idPedido]);

  if (loading) return <p>Cargando mapa...</p>;

  if (rutas.length === 0)
    return <p>No hay rutas generadas para este pedido.</p>;

  const ruta = rutas[0];

  const origen = [ruta.origen_lat, ruta.origen_lng];
  const destino = [ruta.destino_lat, ruta.destino_lng];

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Mapa de la Ruta</h3>

      <MapContainer
        center={origen}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "400px", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={origen} icon={iconSucursal}>
          <Popup>
            <strong>Sucursal</strong>
            <br />
            Lat: {ruta.origen_lat}
            <br />
            Lng: {ruta.origen_lng}
          </Popup>
        </Marker>

        <Marker position={destino} icon={iconCliente}>
          <Popup>
            <strong>Cliente</strong>
            <br />
            Lat: {ruta.destino_lat}
            <br />
            Lng: {ruta.destino_lng}
          </Popup>
        </Marker>
        <Polyline positions={[origen, destino]} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
}

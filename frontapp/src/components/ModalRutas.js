import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./pedidos/ModalRutas.css";

const iconOrigen = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconDestino = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconVehiculo = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function FitBounds({ positions, autoFit }) {
  const map = useMap();

  useEffect(() => {
    if (!autoFit) return; 
    if (positions && positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, autoFit, map]);

  return null;
}

function MapUserInteraction({ onUserAction }) {
  const map = useMap();

  useEffect(() => {
    const stopAutoFit = () => onUserAction();
    map.on("zoomstart", stopAutoFit);
    map.on("movestart", stopAutoFit);

    return () => {
      map.off("zoomstart", stopAutoFit);
      map.off("movestart", stopAutoFit);
    };
  }, [map, onUserAction]);

  return null;
}

function ModalRutas({ idPedido, onClose }) {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rutaIndex, setRutaIndex] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [vehiculoIndex, setVehiculoIndex] = useState(0);
  const [darkMap, setDarkMap] = useState(false);
  const [autoFit, setAutoFit] = useState(true); 

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/pedidos/${idPedido}/rutas`
        );
        const data = await res.json();
        setRutas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando rutas:", err);
        setRutas([]);
      }
      setLoading(false);
      setAutoFit(true); 
    }

    cargar();
  }, [idPedido]);

  useEffect(() => {
    setTracking(false);
    setVehiculoIndex(0);
    setAutoFit(true); 
  }, [rutaIndex]);

  const rutaSel = rutas[rutaIndex];

  let polylinePositions = [];
  if (rutaSel?.geometry?.length > 1) {
    polylinePositions = rutaSel.geometry.map((p) => [p.lat, p.lng]);
  } else if (rutaSel) {
    polylinePositions = [
      [rutaSel.origen_lat, rutaSel.origen_lng],
      [rutaSel.destino_lat, rutaSel.destino_lng],
    ];
  }
  useEffect(() => {
    if (!tracking || polylinePositions.length === 0) return;

    setVehiculoIndex(0);
    const total = polylinePositions.length;

    const interval = setInterval(() => {
      setVehiculoIndex((prev) => {
        if (prev >= total - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [tracking, rutaIndex]);

  const distanciaKm = rutaSel ? Number(rutaSel.distancia_km).toFixed(2) : "0.00";
  const duracionMin = rutaSel ? rutaSel.duracion_min : 0;

  const eta = (() => {
    if (!duracionMin) return "--:--";
    const ahora = new Date();
    const ms = duracionMin * 60 * 1000;
    const etaDate = new Date(ahora.getTime() + ms);
    return etaDate.toLocaleTimeString("es-GT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  })();

  const colorRuta =
    rutaIndex === 0 ? "#2E86DE" : rutaIndex === 1 ? "#27AE60" : "#E67E22";

  return (
    <div className="modal-overlay-rutas">
      <div className="modal-card-rutas">
        <div className="header-modal-rutas">
          <h2>Rutas del Pedido #{idPedido}</h2>

          <div className="header-actions-rutas">
            <button
              className={`toggle-map-btn ${darkMap ? "activo" : ""}`}
              onClick={() => setDarkMap((v) => !v)}
            >
              {darkMap ? "Mapa Claro" : "Mapa Oscuro"}
            </button>

            <button className="cerrar-x" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {loading ? (
          <p>Cargando rutas...</p>
        ) : rutas.length === 0 ? (
          <p>No hay rutas generadas para este pedido.</p>
        ) : (
          <>
            <div className="info-panel-rutas">
              <div className="info-item">
                <span>Ruta seleccionada</span>
                <strong>Ruta {rutaIndex + 1}</strong>
              </div>
              <div className="info-item">
                <span>Distancia</span>
                <strong>{distanciaKm} km</strong>
              </div>
              <div className="info-item">
                <span>Duración</span>
                <strong>{duracionMin} min</strong>
              </div>
              <div className="info-item">
                <span>ETA aprox.</span>
                <strong>{eta}</strong>
              </div>
            </div>

            <div className="selector-rutas">
              {rutas.map((r, idx) => (
                <button
                  key={r.id_ruta}
                  className={`btn-ruta ${idx === rutaIndex ? "activo" : ""}`}
                  onClick={() => setRutaIndex(idx)}
                >
                  Ruta {idx + 1} · {Number(r.distancia_km).toFixed(1)} km
                </button>
              ))}

              <div className="tracking-buttons">
                <button
                  className={`btn-tracking ${tracking ? "activo" : ""}`}
                  onClick={() => setTracking(true)}
                  disabled={tracking || polylinePositions.length === 0}
                >
                  ▶ Simular recorrido
                </button>

                <button
                  className="btn-tracking detener"
                  onClick={() => {
                    setTracking(false);
                    setVehiculoIndex(0);
                  }}
                >
                  ⏹ Detener
                </button>
              </div>
            </div>
            <div className="map-wrapper-rutas">
              <MapContainer
                center={
                  polylinePositions.length
                    ? polylinePositions[0]
                    : [14.62, -90.53]
                }
                zoom={13}
                className="map-rutas"
              >
                <TileLayer
                  url={
                    darkMap
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                  }
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapUserInteraction onUserAction={() => setAutoFit(false)} />

                <FitBounds
                  positions={polylinePositions}
                  autoFit={autoFit}
                />
                <Polyline
                  positions={polylinePositions}
                  pathOptions={{
                    color: "#000000",
                    weight: 10,
                    opacity: 0.25,
                  }}
                />

                <Polyline
                  positions={polylinePositions}
                  pathOptions={{
                    color: colorRuta,
                    weight: 6,
                    opacity: 0.95,
                  }}
                />

                <Marker
                  position={[rutaSel.origen_lat, rutaSel.origen_lng]}
                  icon={iconOrigen}
                >
                  <Popup>Origen (Sucursal)</Popup>
                </Marker>
                <Marker
                  position={[rutaSel.destino_lat, rutaSel.destino_lng]}
                  icon={iconDestino}
                >
                  <Popup>Destino (Cliente)</Popup>
                </Marker>
                {tracking &&
                  vehiculoIndex < polylinePositions.length && (
                    <Marker
                      position={polylinePositions[vehiculoIndex]}
                      icon={iconVehiculo}
                    >
                      <Popup>Vehículo en ruta</Popup>
                    </Marker>
                  )}
              </MapContainer>
            </div>
          </>
        )}

        <div className="footer-modal-rutas">
          <button className="btn-cerrar-rutas" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRutas;

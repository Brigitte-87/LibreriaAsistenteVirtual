import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Envio.css";
import "./leafletCustom.css";
import L from "leaflet";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        let direccion = data.display_name || "Dirección no disponible";

        const zonas = direccion.match(/Zona\s*\d+/gi);
        const zonaDetectada =
          zonas && zonas.length > 0 ? zonas[0].replace(/\D/g, "") : "";

        onSelect({
          lat,
          lng,
          direccion,
          zona: zonaDetectada,
        });
      } catch (error) {
        onSelect({
          lat,
          lng,
          direccion: "Error al obtener dirección",
          zona: "",
        });
      }
    },
  });

  return position ? (
    <Marker position={position} icon={customIcon}>
      <Popup>📍 Dirección seleccionada</Popup>
    </Marker>
  ) : null;
}

function Envio({ total, onVolver, librosCarrito = [] }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [dpi, setDpi] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pos, setPos] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  const calcularEnvio = (z) => {
    const num = parseInt(z);
    if (!num) return 0;
    if (num <= 5) return 15;
    if (num <= 10) return 25;
    if (num <= 15) return 35;
    return 40;
  };

  const envio = calcularEnvio(zona);
  const totalFinal = total + envio;

  const handleMapSelect = (data) => {
    setPos({ lat: data.lat, lng: data.lng });
    setDireccion(data.direccion);
    setZona(data.zona);
    setMapKey((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !telefono || !nit || !dpi) {
      alert("⚠️ Completa todos los campos personales.");
      return;
    }

    if (!pos || !direccion || !zona) {
      alert("⚠️ Selecciona una ubicación en el mapa.");
      return;
    }

    try {
      const resSuc = await axios.post(
        "http://localhost:4000/api/sucursales/nearest",
        {
          lat: pos.lat,
          lng: pos.lng,
        }
      );

      const nearest = resSuc.data.mejorSucursal;

      if (!nearest) {
        alert("No se pudo determinar la sucursal más cercana.");
        return;
      }

      const id_sucursal = nearest.id_sucursal;

      const res = await axios.post("http://localhost:4000/api/pedidos", {
        nombre,
        apellido,
        telefono,
        nit,
        dpi,
        direccion,
        zona,
        lat: pos.lat,
        lng: pos.lng,
        total: totalFinal,
        estado: 0,
        libros: librosCarrito,
        id_sucursal,
      });

      setConfirmacion(res.data);
    } catch (error) {
      setConfirmacion({
        error: true,
        mensaje: "No se pudo confirmar el pedido. Intenta nuevamente.",
      });
    }
  };

  const descargarComprobante = async () => {
    const elemento = document.getElementById("comprobantePDF");
    const canvas = await html2canvas(elemento, { scale: 2, useCORS: true });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const ancho = pdf.internal.pageSize.getWidth();
    const alto = (canvas.height * ancho) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, ancho, alto);
    pdf.save(`Comprobante_Pedido_${confirmacion.pedidoId}.pdf`);
  };

  const handleNuevoPedido = () => {
    window.location.reload();
  };

  return (
    <div className="envio-page">
      <div className="envio-container">
        <h2>🚚 Detalles de Envío</h2>

        {!confirmacion ? (
          <form className="envio-form" onSubmit={handleSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </label>

            <label>
              Apellido:
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </label>

            <label>
              Teléfono:
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </label>

            <label>
              NIT:
              <input
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                required
              />
            </label>

            <label>
              DPI:
              <input
                type="text"
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
                required
              />
            </label>

            <label>
              Zona:
              <input
                type="text"
                value={zona ? `Zona ${zona}` : ""}
                readOnly
                style={{
                  background: "#eee",
                  color: "#444",
                  cursor: "not-allowed",
                }}
              />
            </label>

            <label>
              Dirección:
              <input
                type="text"
                value={direccion}
                readOnly
                style={{
                  background: "#eee",
                  cursor: "not-allowed",
                }}
                required
              />
            </label>

            <MapContainer
              key={mapKey}
              center={pos ? [pos.lat, pos.lng] : [14.6349, -90.5069]}
              zoom={14}
              style={{
                height: "420px",
                width: "100%",
                borderRadius: "15px",
                marginTop: "15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationMarker onSelect={handleMapSelect} />
              {pos && <Marker position={pos} icon={customIcon}></Marker>}
            </MapContainer>

            <div className="resumen">
              <p>
                <strong>Zona:</strong>
                {zona ? ` Zona ${zona}` : "No detectada"}
              </p>
              <p>
                <strong>Subtotal:</strong> Q{total.toFixed(2)}
              </p>
              <p>
                <strong>Envío:</strong> Q{envio.toFixed(2)}
              </p>

              <hr />

              <p className="total">
                <strong>Total final:</strong> Q{totalFinal.toFixed(2)}
              </p>
            </div>

            <div className="botones">
              <button type="button" onClick={onVolver} className="btn-volver">
                ⬅ Volver
              </button>
              <button type="submit" className="btn-confirmar">
                Confirmar pedido
              </button>
            </div>
          </form>
        ) : (
          <div className="confirmacion">
            <div id="comprobantePDF">
              <h3>🎉 ¡Gracias por tu compra, {nombre}!</h3>
              <p>
                Tu número de pedido es{" "}
                <strong>#{confirmacion.pedidoId}</strong>
              </p>

              <table className="tabla-detalle" style={{ marginTop: "25px" }}>
                <tbody>
                  <tr>
                    <td>Cliente</td>
                    <td>
                      {nombre} {apellido}
                    </td>
                  </tr>
                  <tr>
                    <td>Teléfono</td>
                    <td>{telefono}</td>
                  </tr>
                  <tr>
                    <td>NIT</td>
                    <td>{nit}</td>
                  </tr>
                  <tr>
                    <td>DPI</td>
                    <td>{dpi}</td>
                  </tr>
                  <tr>
                    <td>Zona</td>
                    <td>{zona}</td>
                  </tr>
                  <tr>
                    <td>Dirección</td>
                    <td>{direccion}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="btn-detalle" onClick={descargarComprobante}>
              📄 Descargar comprobante
            </button>
            <button className="btn-detalle" onClick={handleNuevoPedido}>
              🛒 Realizar otro pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Envio;

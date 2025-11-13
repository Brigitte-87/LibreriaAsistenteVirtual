import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Envio.css";
import "./leafletCustom.css";
import L from "leaflet";
import axios from "axios";

// 📄 Librerías para generar el PDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

// 📍 MARCADOR — selecciona dirección en el mapa
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

        // Detectar zona automáticamente
        const zonas = direccion.match(/Zona\s*\d+/gi);
        const zonaDetectada = zonas && zonas.length > 0 ? zonas[0].replace(/\D/g, "") : "";

        if (zonas && zonas.length > 1) {
          zonas.slice(1).forEach((z) => {
            direccion = direccion.replace(z, "").trim();
          });
        }

        onSelect({ lat, lng, direccion, zona: zonaDetectada });
      } catch (error) {
        console.error("Error al obtener dirección:", error);
        onSelect({ lat, lng, direccion: "Error al obtener dirección", zona: "" });
      }
    },
  });

  return position ? (
    <Marker position={position} icon={customIcon}>
      <Popup>📍 Dirección seleccionada</Popup>
    </Marker>
  ) : null;
}

// 🚚 COMPONENTE PRINCIPAL
function Envio({ total, onVolver, librosCarrito = [] }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [dpi, setDpi] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pos, setPos] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [confirmacion, setConfirmacion] = useState(null);

  // 🚛 Cálculo de envío y transporte
  const calcularEnvio = (z) => {
    const num = parseInt(z);
    if (!num) return 0;
    if (num <= 5) return 15;
    if (num <= 10) return 25;
    if (num <= 15) return 35;
    return 40;
  };

  const determinarTransporte = (z) => {
    const num = parseInt(z);
    if (!num) return { tipo: "—", icon: "" };
    if (num <= 5) return { tipo: "Moto", icon: "🏍️", clase: "anim-moto" };
    if (num <= 10) return { tipo: "Motocicleta", icon: "🏍️", clase: "anim-moto" };
    if (num <= 15) return { tipo: "Pickup", icon: "🚚", clase: "anim-truck" };
    return { tipo: "Camioneta", icon: "🚛", clase: "anim-truck" };
  };

  const envio = calcularEnvio(zona);
  const transporte = determinarTransporte(zona);
  const totalFinal = total + envio;

  // 📄 FUNCIÓN PARA DESCARGAR PDF
  const descargarComprobante = async () => {
    const elemento = document.getElementById("comprobantePDF");

    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const ancho = pdf.internal.pageSize.getWidth();
    const alto = (canvas.height * ancho) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, ancho, alto);
    pdf.save(`Comprobante_Pedido_${confirmacion.pedidoId}.pdf`);
  };

  // ======================== ENVÍO DATOS BACKEND ======================
  const handleMapSelect = (data) => {
    setPos({ lat: data.lat, lng: data.lng });
    setDireccion(data.direccion);
    if (data.zona) setZona(data.zona);
    setMapKey((prev) => prev + 1);
  };

  const handleDireccionChange = async (e) => {
    const nuevaDireccion = e.target.value;
    setDireccion(nuevaDireccion);

    if (nuevaDireccion.length > 8) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            nuevaDireccion
          )}`
        );
        const results = await response.json();
        if (results.length > 0) {
          const { lat, lon, display_name } = results[0];
          const zonas = display_name.match(/Zona\s*\d+/gi);
          const zonaDetectada = zonas && zonas.length > 0 ? zonas[0].replace(/\D/g, "") : "";
          let direccionLimpia = display_name;
          if (zonas && zonas.length > 1) {
            zonas.slice(1).forEach((z) => {
              direccionLimpia = direccionLimpia.replace(z, "").trim();
            });
          }
          setPos({ lat: parseFloat(lat), lng: parseFloat(lon) });
          setDireccion(direccionLimpia);
          if (zonaDetectada) setZona(zonaDetectada);
          setMapKey((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error al ubicar dirección escrita:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !telefono || !nit || !dpi || !direccion || !zona) {
      alert("⚠️ Completa todos los campos antes de confirmar.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/pedidos", {
        nombre,
        apellido,
        telefono,
        nit,
        dpi,
        direccion,
        zona: `Zona ${zona}`,
        total: totalFinal,
      });
      setConfirmacion(res.data);
    } catch (error) {
      console.error("❌ Error al confirmar pedido:", error);
      setConfirmacion({
        error: true,
        mensaje: "No se pudo confirmar el pedido. Intenta nuevamente.",
      });
    }
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

            {/* === FORMULARIO === */}
            <label>
              Nombre:
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Ana"
                required
              />
            </label>

            <label>
              Apellido:
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej. López"
                required
              />
            </label>

            <label>
              Teléfono:
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 5555-1234"
                required
              />
            </label>

            <label>
              NIT:
              <input
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                placeholder="Ej. 1234567-8"
                required
              />
            </label>

            <label>
              DPI:
              <input
                type="text"
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
                placeholder="Ej. 1234567890101"
                required
              />
            </label>

            <label>
              Zona:
              <select value={zona} onChange={(e) => setZona(e.target.value)} required>
                <option value="">Seleccione zona</option>
                {Array.from({ length: 21 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Zona {i + 1}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Dirección:
              <input
                type="text"
                value={direccion}
                onChange={handleDireccionChange}
                placeholder="Haz clic en el mapa o escribe tu dirección"
                required
              />
            </label>

            {/* === MAPA === */}
            <MapContainer
              key={mapKey}
              center={pos ? [pos.lat, pos.lng] : [14.6349, -90.5069]}
              zoom={14}
              style={{
                height: "420px",
                width: "100%",
                borderRadius: "15px",
                marginTop: "15px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker onSelect={handleMapSelect} />
              {pos && <Marker position={pos} icon={customIcon}></Marker>}
            </MapContainer>

            {/* === RESUMEN === */}
            <div className="resumen">
              <p>
                <strong>Zona:</strong> {zona ? `Zona ${zona}` : "No detectada"}
              </p>
              <p className="transporte">
                <strong>Transporte:</strong> {transporte.tipo}{" "}
                <span className={transporte.clase}>{transporte.icon}</span>
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

            {/* ===================== COMPROBANTE PDF ===================== */}
            <div id="comprobantePDF">

              {confirmacion.error ? (
                <p className="error">{confirmacion.mensaje}</p>
              ) : (
                <>
                  <h3>🎉 ¡Gracias por tu compra, {nombre}!</h3>
                  <p>
                    Tu número de pedido es <strong>#{confirmacion.pedidoId}</strong>
                  </p>

                  <p>
                    <strong>Sucursal:</strong> {confirmacion.sucursal}
                  </p>

                  {/* 📚 Tabla con detalle de libros */}
                  {librosCarrito.length > 0 && (
                    <>
                      <h4 style={{ marginTop: "25px", color: "#3F7856" }}>
                        📚 Detalle de Libros
                      </h4>
                      <table className="tabla-detalle">
                        <thead>
                          <tr>
                            <th>Libro</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {librosCarrito.map((libro, index) => (
                            <tr key={index}>
                              <td>{libro.titulo}</td>
                              <td>{libro.cantidad || 1}</td>
                              <td>Q{libro.precio.toFixed(2)}</td>
                              <td>Q{(libro.precio * (libro.cantidad || 1)).toFixed(2)}</td>
                            </tr>
                          ))}

                          {/* SUBTOTAL */}
                          <tr>
                            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
                              Subtotal libros
                            </td>
                            <td style={{ fontWeight: "bold" }}>
                              Q{total.toFixed(2)}
                            </td>
                          </tr>

                          {/* ENVÍO */}
                          <tr>
                            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
                              Envío
                            </td>
                            <td style={{ fontWeight: "bold" }}>
                              Q{envio.toFixed(2)}
                            </td>
                          </tr>

                          {/* TOTAL FINAL */}
                          <tr style={{ background: "#e8ffe8" }}>
                            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold", fontSize: "1.1em" }}>
                              TOTAL FINAL
                            </td>
                            <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                              Q{totalFinal.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}

                  {/* DATOS DEL CLIENTE */}
                  <table className="tabla-detalle" style={{ marginTop: "25px" }}>
                    <thead>
                      <tr>
                        <th>Dato</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cliente</td>
                        <td>{nombre} {apellido}</td>
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
                </>
              )}
            </div>

            {/* ======= FIN DEL PDF ======== */}

            {/* BOTONES */}
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

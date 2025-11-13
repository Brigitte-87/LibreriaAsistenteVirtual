// ✅ fixLeafletIcons.js — versión final sin dependencias rotas
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configurar los íconos manualmente desde /public/leaflet-images/
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `${process.env.PUBLIC_URL}/leaflet-images/marker-icon-2x.png`,
  iconUrl: `${process.env.PUBLIC_URL}/leaflet-images/marker-icon.png`,
  shadowUrl: `${process.env.PUBLIC_URL}/leaflet-images/marker-shadow.png`,
});

export default L;

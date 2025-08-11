import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const AQI_COLORS = [
  { max: 50, color: "#009966" },
  { max: 100, color: "#ffde33" },
  { max: 150, color: "#ff9933" },
  { max: 200, color: "#cc0033" },
  { max: 300, color: "#660099" },
  { max: Infinity, color: "#7e0023" },
];

const getAQIColor = (aqi) => {
  for (const level of AQI_COLORS) {
    if (aqi <= level.max) return level.color;
  }
  return "#999";
};

export default function MapSection({ selectedStation }) {
  const [stations, setStations] = useState([]);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("/api/locations");
        const data = res.data || [];
        setStations(data);

        if (selectedStation) {
          const match = data.find(
            (s) =>
              s.name &&
              s.name.toLowerCase() === selectedStation.toLowerCase()
          );
          if (match?.latitude && match?.longitude) {
            setMapCenter([match.latitude, match.longitude]);
            setZoom(13);
          }
        }
      } catch (err) {
        console.error("Map fetch error:", err);
      }
    };

    fetchStations();
  }, [selectedStation]);

  return (
      <div className="w-full h-[460px] bg-white rounded-2xl shadow-lg border border-gray-200 p-4 overflow-hidden">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            AQI Monitoring Stations
          </h2>
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: "88%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        

          {stations.map((station, idx) => {
            const aqi = station.aqi;
            const color = getAQIColor(aqi);
            const isSelected = selectedStation?.toLowerCase() === station.name?.toLowerCase();

          const icon = L.divIcon({
            className: "custom-aqi-icon",
            html: `
              <div style="
                background: ${color};
                color: #000;
                font-size: 12px;
                padding: 4px 10px;
                border-radius: 9999px;
                text-align: center;
                font-weight: 500;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(0, 0, 0, 0.2);
              ">
                ${aqi}
              </div>
            `,
            iconSize: [36, 24],
            iconAnchor: [18, 12],
          });

          return (
            <Marker
              key={idx}
              position={[station.latitude, station.longitude]}
              icon={icon}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={isSelected}>
                <div className="text-xs font-medium text-center text-black">
                  {station.name}
                  <br />
                  AQI: {aqi}
                </div>
              </Tooltip>
            </Marker>
          );
          })}
        </MapContainer>
      </div>
  );
}















// // src/components/MapSection.jsx
// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// export default function MapSection({ lat = 28.65, lon = 77.28, location = "Anand Vihar", aqi = 175 }) {
//   return (
//     <div className="flex-1 rounded-xl overflow-hidden shadow h-64">
//       <MapContainer center={[lat, lon]} zoom={12} style={{ height: "100%", width: "100%" }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />
//         <Marker position={[lat, lon]}>
//           <Popup>
//             {location} <br />
//             AQI: {aqi}
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// }


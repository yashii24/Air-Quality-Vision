import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip
} from "react-leaflet";
import L from "leaflet";
import api from "../services/api";
import "leaflet/dist/leaflet.css";

const AQI_COLORS = [
  { min: 0, max: 50, color: "#009966" },
  { min: 51, max: 100, color: "#ffde33" },
  { min: 101, max: 150, color: "#ff9933" },
  { min: 151, max: 200, color: "#cc0033" },
  { min: 201, max: 300, color: "#660099" },
  { min: 301, max: 500, color: "#7e0023" }
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
        const res = await api.get("/api/locations");
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

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "88%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((station, idx) => {
          const aqi = station.aqi;
          const color = getAQIColor(aqi);
          const isSelected =
            selectedStation?.toLowerCase() === station.name?.toLowerCase();

          const icon = L.divIcon({
            className: "custom-aqi-icon",
            html: `
              <div style="
                background:${color};
                padding:4px 10px;
                border-radius:9999px;
                font-size:12px;
                font-weight:500;
                box-shadow:0 2px 6px rgba(0,0,0,.2);
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
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={isSelected}
              >
                <div className="text-xs font-medium text-black text-center">
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
















import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function StationMap({ stations = [], onStationClick }) {
  useEffect(() => {
    const map = L.map("stationMap").setView([28.6139, 77.2090], 10); // Delhi center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    stations.forEach((s) => {
      if (s.lat && s.lon) {
        const marker = L.marker([s.lat, s.lon]).addTo(map);
        marker.bindPopup(`
          <b>${s.name || s.station || "Unnamed Station"}</b><br>
          AQI: ${s.realtime_aqi ?? "—"}
        `);
        marker.on("click", () => {
          if (onStationClick) onStationClick(s);
        });
      }
    });

    return () => {
      map.remove();
    };
  }, [stations, onStationClick]);

  return (
    <div
      id="stationMap"
      style={{ height: "480px", width: "100%", borderRadius: "8px" }}
    ></div>
  );
}

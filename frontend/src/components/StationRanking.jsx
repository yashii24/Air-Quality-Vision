import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AQI_LEVELS = [
  { label: "Good", max: 50, color: "#009966" },
  { label: "Satisfactory", max: 100, color: "#ffde33" },
  { label: "Moderate", max: 200, color: "#ff9933" },
  { label: "Poor", max: 300, color: "#cc0033" },
  { label: "Very Poor", max: 400, color: "#660099" },
  { label: "Severe", max: Infinity, color: "#7e0023" },
];

const getAQIInfo = (aqi) => {
  for (const level of AQI_LEVELS) {
    if (aqi <= level.max) return level;
  }
  return { label: "Unknown", color: "#999" };
};

export default function StationRanking({ onStationClick }) {
  const [stations, setStations] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("/api/locations");
        const data = res.data || [];
        const sorted = data
          .filter((s) => s.aqi !== null && s.aqi !== undefined)
          .sort((a, b) => a.aqi - b.aqi);
        setStations(sorted);
      } catch (err) {
        console.error("Error fetching ranking data:", err);
      }
    };

    fetchStations();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 75; // Adjust for item height
        if (
          scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight
        ) {
          // Reset to top when scrolled to end
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [stations]);

  return (
    <div className="w-full rounded-xl shadow bg-white">
      <h2 className="text-xl font-bold p-4">Stations Ranked by AQI</h2>
      <div
        ref={scrollRef}
        className="max-h-[400px] overflow-y-auto scroll-smooth px-4 pb-4"
      >
        <ul className="space-y-3">
          {stations.map((station, index) => {
            const { color, label } = getAQIInfo(station.aqi);
            return (
              <li
                key={station.name}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition hover:scale-[1.01]"
                style={{ backgroundColor: color + "22" }}
                onClick={() => onStationClick && onStationClick(station.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold w-6 text-gray-700">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{station.name}</div>
                    <div className="text-xs text-gray-700">{label}</div>
                  </div>
                </div>
                <div
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: color, color: "#fff" }}
                >
                  {station.aqi}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

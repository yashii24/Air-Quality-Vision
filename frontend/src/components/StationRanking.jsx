import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";

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

// Allowed stations list stays unchanged
const ALLOWED_STATIONS = [
  "Lodhi Road, Delhi, Delhi, India",
  "Pusa, Delhi, Delhi, India",
  "Delhi Institute of Tool Engineering, Wazirpur, Delhi, Delhi, India",
  "R.K. Puram, Delhi, Delhi, India",
  "Shadipur, Delhi, Delhi, India",
  "National Institute of Malaria Research, Sector 8, Dwarka, Delhi, Delhi, India",
  "ITI Shahdra, Jhilmil Industrial Area, Delhi, Delhi, India",
  "Sonia Vihar Water Treatment Plant DJB, Delhi, Delhi, India",
  "Shaheed Sukhdev College of Business Studies, Rohini, Delhi, Delhi, India",
  "Aya Nagar, Delhi, Delhi, India",
  "ITI Jahangirpuri, Delhi, Delhi, India",
  "Bramprakash Ayurvedic Hospital, Najafgarh, Delhi, Delhi, India",
  "CRRI Mathura Road, Delhi, Delhi, India",
  "Burari Crossing, Delhi, Delhi, India",
  "Punjabi Bagh, Delhi, Delhi, India",
  "Mundka, Delhi, Delhi, India",
  "ITO, Delhi, Delhi, India",
  "Sri Auribindo Marg, Delhi, Delhi, India",
  "Narela, Delhi, Delhi, India",
  "Alipur, Delhi, Delhi, India",
  "Pooth Khurd, Bawana, Delhi, Delhi, India",
  "Dr. Karni Singh Shooting Range, Delhi, Delhi, India",
  "Satyawati College, Delhi, Delhi, India",
  "DITE Okhla, Delhi, Delhi, India",
  "Anand Vihar, Delhi, Delhi, India",
  "Mother Dairy Plant, Parparganj, Delhi, Delhi, India",
  "Jawaharlal Nehru Stadium, Delhi, Delhi, India",
  "Mandir Marg, Delhi, Delhi, India",
  "Major Dhyan Chand National Stadium, Delhi, Delhi, India",
  "DTU, Delhi, Delhi, India",
];

export default function StationRanking({ onStationClick }) {
  const [stations, setStations] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get("/api/locations");
        const data = res.data || [];

        const filtered = data
          .filter((s) => ALLOWED_STATIONS.includes(s.name))
          .filter((s) => s.aqi !== null && s.aqi !== undefined)
          .sort((a, b) => a.aqi - b.aqi);

        setStations(filtered);
      } catch (err) {
        console.error("Error fetching ranking data:", err);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 75;
        if (
          scrollRef.current.scrollTop +
            scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [stations]);

  return (
    <div className="w-full h-[460px] bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 p-4">
        Stations Ranked by AQI
      </h2>

      <div
        ref={scrollRef}
        className="h-[370px] overflow-y-auto px-4 py-1 space-y-3 scroll-smooth"
      >
        <ul className="space-y-3">
          {stations.map((station, index) => {
            const { color, label } = getAQIInfo(station.aqi);

            return (
              <li
                key={station.name}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition hover:scale-[1.01]"
                style={{ backgroundColor: color + "22" }}
                onClick={() =>
                  onStationClick && onStationClick(station.name)
                }
              >
                <div className="flex items-center gap-3">
                  <div className="text-base font-bold text-gray-700 w-6">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {station.name}
                    </div>
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

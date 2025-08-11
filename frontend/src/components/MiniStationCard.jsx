import React from "react";
import { MapPin, Clock } from "lucide-react"; // icon library

export default function MiniStationCard({ station = {}, onClick }) {
  const aqi =
    station.realtime_aqi ??
    station.aqi ??
    station.calculated_indian_aqi ??
    station.calculated_aqi ??
    null;

  const color = getColor(aqi);
  const status = getStatusLabel(aqi);
  const friendlyMessage = getFriendlyMessage(status);
  const lastUpdatedText = station.lastUpdated || station.time?.s || "Live data";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border border-gray-100"
      style={{
        background: `linear-gradient(135deg, ${color}20, #ffffff)`,
      }}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" /> Delhi
          </div>
          <div className="font-semibold text-gray-900 text-lg">
            {station.name || station.station || "Unnamed Station"}
          </div>
        </div>

        {/* AQI badge */}
        <div className="flex flex-col items-end">
          <div className="text-3xl font-extrabold text-gray-900">{aqi ?? "—"}</div>
          <div
            className="text-xs px-2 py-1 rounded-full text-white mt-1 shadow-sm"
            style={{ backgroundColor: color }}
          >
            {status}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between text-[13px] text-gray-700">
        <div>{friendlyMessage}</div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          {lastUpdatedText}
        </div>
      </div>
    </div>
  );
}

/* helpers */
function getColor(aqi) {
  if (isNaN(aqi)) return "#9CA3AF";
  if (aqi <= 50) return "#2f855a"; // green
  if (aqi <= 100) return "#8FB82B";
  if (aqi <= 200) return "#F6E05E";
  if (aqi <= 300) return "#F59E0B";
  if (aqi <= 400) return "#EF4444";
  if (aqi <= 500) return "#9B2C2C";
  return "#7e0023";
}

function getStatusLabel(aqi) {
  if (isNaN(aqi)) return "N/A";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Unhealthy";
  if (aqi <= 400) return "Severe";
  if (aqi <= 500) return "Hazardous";
  return "⚠️";
}

function getFriendlyMessage(status) {
  switch (status) {
    case "Good":
      return "🌿 Good – Enjoy the outdoors!";
    case "Moderate":
      return "😌 Moderate – Safe for most people";
    case "Poor":
      return "😷 Poor – Might affect sensitive groups";
    case "Unhealthy":
      return "🚫 Unhealthy – Limit outdoor activity";
    case "Severe":
      return "🛑 Severe – Avoid going outside";
    case "Hazardous":
      return "☠️ Hazardous – Health warning for everyone";
    default:
      return "ℹ️ No data available";
  }
}

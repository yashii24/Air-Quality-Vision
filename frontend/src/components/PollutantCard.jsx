// src/components/PollutantCard.jsx
import React from "react";
import {Wind, Cloud, Droplets, Sun, Thermometer, AlertTriangle, HelpCircle,} from "lucide-react"; 

export default function PollutantCard({ name = "PM2.5", value = 134, unit = "µg/m³" }) {
  const getBgColor = (value) => {
    if (value <= 30) return "bg-green-100 text-green-700";
    if (value <= 60) return "bg-yellow-100 text-yellow-700";
    if (value <= 90) return "bg-orange-100 text-orange-700";
    if (value <= 120) return "bg-red-100 text-red-700";
    return "bg-purple-100 text-purple-700";
  };

  const iconMap = {
    "PM2.5": <Wind className="text-3xl mb-2" />,
    "PM10": <Cloud className="text-3xl mb-2" />,
    "NO₂": <Droplets className="text-3xl mb-2" />,
    "O₃": <Sun className="text-3xl mb-2" />,
    "CO": <Thermometer className="text-3xl mb-2" />,
    "SO₂": <AlertTriangle className="text-3xl mb-2" />,
  };
  const icon = iconMap[name] || <HelpCircle className="text-3xl mb-2" />;

  return (
    <div className={`rounded-xl shadow p-4 flex flex-col items-center ${getBgColor(value)}`}>
      {icon}
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm">{unit}</p>
    </div>
  );
}


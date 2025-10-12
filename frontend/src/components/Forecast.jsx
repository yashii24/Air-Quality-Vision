// src/components/Forecast.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

export default function Forecast({ station }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!station) return;

    const fetchForecast = async () => {
      try {
        const res = await axios.post("/api/forecast", { station, hours: 72 });
        setForecast(res.data.forecast || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchForecast();
  }, [station]);

  // Map PM2.5 to AQI colors
  const getAQIColor = (pm25) => {
    if (pm25 <= 12) return "#009966"; // Good
    if (pm25 <= 35.4) return "#ffde33"; // Moderate
    if (pm25 <= 55.4) return "#ff9933"; // Unhealthy for sensitive
    if (pm25 <= 150.4) return "#cc0033"; // Unhealthy
    if (pm25 <= 250.4) return "#660099"; // Very unhealthy
    return "#7e0023"; // Hazardous
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 mt-6">
      <h2 className="text-xl font-semibold mb-4">PM2.5 Forecast for {station}</h2>

      {/* Line Chart */}
      {forecast.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={forecast.map((f) => ({
              Timestamp: f.Timestamp,
              PM25: f.PM25, // ✅ directly from backend
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Timestamp"
              tickFormatter={(ts) =>
                new Date(ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip
              labelFormatter={(ts) => new Date(ts).toLocaleString()}
              formatter={(value) =>
                value !== null
                  ? [`${value.toFixed(2)} µg/m³`, "PM2.5"]
                  : ["N/A", "PM2.5"]
              }
            />
            <Line
              type="monotone"
              dataKey="PM25"
              stroke="#ff4d4f"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Scrollable cards */}
      <div className="mt-4 flex overflow-x-auto space-x-3 pb-2">
        {forecast.map((f, i) => {
          const pm25 = f.PM25; // ✅ direct from backend
          if (pm25 === undefined || pm25 === null) return null;

          const dateObj = new Date(f.Timestamp);

          // Determine AQI category
          let category = "";
          if (pm25 <= 12) category = "Good";
          else if (pm25 <= 35.4) category = "Moderate";
          else if (pm25 <= 55.4) category = "Unhealthy for Sensitive";
          else if (pm25 <= 150.4) category = "Unhealthy";
          else if (pm25 <= 250.4) category = "Very Unhealthy";
          else category = "Hazardous";

          const colors = {
            Good: "#009966",
            Moderate: "#ffde33",
            "Unhealthy for Sensitive": "#ff9933",
            Unhealthy: "#cc0033",
            "Very Unhealthy": "#660099",
            Hazardous: "#7e0023",
          };

          return (
            <div
              key={i}
              className="min-w-[100px] p-3 rounded-xl shadow-lg text-white flex flex-col items-center justify-between transition-transform transform hover:scale-105"
              style={{ backgroundColor: colors[category] }}
            >
              <div className="text-xs">
                {dateObj.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-sm font-semibold">{dateObj.getHours()}:00</div>
              <div className="text-lg font-bold">{pm25.toFixed(1)}</div>
              <div className="text-xs mt-1">{category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

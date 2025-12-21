import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TrendChart({ station, date, pollutant }) {
  const [chartData, setChartData] = useState([]);
  const [trendType, setTrendType] = useState("hourly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrendData = async () => {
    if (!station || !date || !pollutant) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        trendType === "hourly"
          ? `/api/trend/hourly?station=${encodeURIComponent(
              station
            )}&date=${date}&pollutant=${pollutant}`
          : `/api/trend/daily?station=${encodeURIComponent(
              station
            )}&pollutant=${pollutant}&month=${date.slice(0, 7)}`;

      const res = await api.get(endpoint);
      const data = res.data?.data ?? [];

      const formatted = data.map((item) => ({
        name:
          trendType === "hourly"
            ? `${item.hour}:00`
            : item.date?.split("T")[0] || `Day ${item.day}`,
        value: item.value ?? null,
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Trend data fetch error:", err);
      setError("Failed to load trend data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendData();
  }, [station, date, pollutant, trendType]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded ${
              trendType === "hourly"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setTrendType("hourly")}
          >
            Hourly
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${
              trendType === "daily"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setTrendType("daily")}
          >
            Daily
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading trend data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" height={60} />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, "Value"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No trend data available.</p>
      )}
    </div>
  );
}

















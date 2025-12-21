import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartComponent({ station, date, pollutant }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!station || !date || !pollutant) return;

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(
          `/api/hourly?station=${station}&date=${date}&pollutant=${pollutant}`
        );

        const data = res.data;

        setChartData({
          labels: data.map((item) => item.time),
          datasets: [
            {
              label: `${pollutant} Concentration`,
              data: data.map((item) => item.value),
              borderColor: getPollutantColor(pollutant),
              backgroundColor: getPollutantColor(pollutant, 0.2),
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to load chart data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [station, date, pollutant]);

  const getPollutantColor = (pollutant, opacity = 1) => {
    const colors = {
      PM25: `rgba(234, 88, 12, ${opacity})`,
      PM10: `rgba(139, 92, 246, ${opacity})`,
      NO2: `rgba(16, 185, 129, ${opacity})`,
      SO2: `rgba(59, 130, 246, ${opacity})`,
      O3: `rgba(245, 158, 11, ${opacity})`,
      CO: `rgba(220, 38, 38, ${opacity})`,
    };
    return colors[pollutant] || `rgba(75, 192, 192, ${opacity})`;
  };

  if (loading) return <div className="text-center py-8">Loading chart...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!chartData)
    return (
      <div className="text-gray-500 p-4">
        Select parameters to view chart
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">
        {pollutant} Levels at {station}
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        {new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="h-80">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                grid: { display: false },
                title: { display: true, text: "Time of Day" },
              },
              y: {
                title: {
                  display: true,
                  text: `Concentration (${
                    pollutant === "CO" ? "mg/m³" : "µg/m³"
                  })`,
                },
                min: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

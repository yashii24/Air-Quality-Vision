import React, { useState } from "react";
import api from "../services/api";
import InputForm from "../components/InputForm";
import AQICard from "../components/AQICard";
import MapSection from "../components/MapSection";
import PollutantCard from "../components/PollutantCard";
import TrendChart from "../components/TrendChart";
import StationRanking from "../components/StationRanking";
import AQIPlaceholderCard from "../components/AQIPlaceholderCard";
import Forecast from "../components/Forecast";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [station, setStation] = useState("");
  const [selectedPollutant, setSelectedPollutant] = useState("PM25");
  const [selectedDate, setSelectedDate] = useState('2023-07-01');

  const handleFetch = async ({ station, date, hour }) => {
    setError(null);
    setData(null);
   
    try {
      const today = new Date().toISOString().split('T')[0];
      let res;

      setStation(station);
      setData(data)
      setSelectedStation(station)
      setSelectedDate(date)

      if (date === today) {
        // Real-time data
        res = await api.get(`/api/realtime?station=${encodeURIComponent(station)}`);
      } else {
        // Historical data
        res = await api.get(
          `/api/aqi?station=${encodeURIComponent(station)}&date=${date}&hour=${hour}`
        );
      }

      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch AQI data.');
    }
  };


 const getPollutantArray = () => {
  if (!data) return [];

  const mapping = {
    PM25: "PM2.5",
    PM10: "PM10",
    NO2: "NO₂",
    Ozone: "O₃",
    CO: "CO",
    SO2: "SO₂",
  };

   const pollutants = [];

  if (data.pollutants) {
    // Historical data format
    for (const [key, label] of Object.entries(mapping)) {
      const upperKey = key.toUpperCase();
      const val = data.pollutants[upperKey] ?? data.pollutants[key] ?? null;
      if (val !== null && val !== undefined) {
        pollutants.push({
          name: label,
          value: Number(val.toFixed(1)),
          unit: key === "co" ? "mg/m³" : "µg/m³",
        });
      }
    }
  } else if (data.iaqi) {
    // Real-time data format (from WAQI)
    for (const [key, label] of Object.entries(mapping)) {
      const val = data.iaqi[key]?.v ?? null;
      if (val !== null && val !== undefined) {
        pollutants.push({
          name: label,
          value: Number(val.toFixed(1)),
          unit: key === "co" ? "mg/m³" : "µg/m³",
        });
      }
    }
  }

  return pollutants;
};


  return (
    <div className="p-4 space-y-12 max-w-screen-xl mx-auto">

      <InputForm onSubmit={(handleFetch)}  />

      
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="h-full w-full">
          <div className="rounded-2xl shadow-lg border border-gray-200 p-6 bg-white w-full h-full">
            {data ? (
              <AQICard data={data} />
            ) : (
              <AQIPlaceholderCard />
            )}
          </div>
        </div>
        
        <MapSection selectedStation={selectedStation} />


      </div>


    {data && data.pollutants && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {getPollutantArray().map((p) => (
              <PollutantCard
                key={p.name}
                name={p.name}
                value={p.value}
                unit={p.unit}
              />
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedPollutant} Trend at {selectedStation}
              </h3>
              <select
                value={selectedPollutant}
                onChange={(e) => setSelectedPollutant(e.target.value)}
                className="p-2 border rounded text-sm"
              >
                <option value="PM25">PM2.5</option>
                <option value="PM10">PM10</option>
                <option value="NO2">NO₂</option>
                <option value="SO2">SO₂</option>
                <option value="O3">O₃</option>
                <option value="CO">CO</option>
              </select>
            </div>
            
            {station && date && selectedPollutant && (
              <div className="mt-6">
                <TrendChart
                  station={station}
                  date={selectedDate}
                  pollutant={selectedPollutant}
                />
              </div>
            )}

          </div>
        </>
      )}


      {data && (
        <Forecast
          station={station}
          date={selectedDate}
          time={new Date().toLocaleTimeString("en-GB", { hour12: false })}
        />
      )}

      <div className="w-full">
        <StationRanking onStationClick={(name) => setSelectedStation(name)} />
      </div>
    </div>
  );
}
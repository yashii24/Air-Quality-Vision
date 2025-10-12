import React, { useState } from "react";
import image2 from "../assets/image2.jpg";
import { useStations } from "../context/StationsContext";

export default function InputForm({ onSubmit }) {
  const [station, setStation] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const { stations: allStations } = useStations();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!station || !date || hour === "") return;
    const extractedHour = parseInt(hour.split(":")[0], 10);
    onSubmit({ station, date, hour: extractedHour });
  };

  return (
    <div
      className="relative flex-1 h-[250px] bg-cover bg-center rounded-xl overflow-hidden"
      style={{ backgroundImage: `url(${image2})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
          Stay Informed with Air Quality Vision
        </h1>
        <p className="text-white text-md md:text-lg mb-8">
          Access live air quality data anytime!
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center"
        >
          <div className="relative w-full sm:w-64">
            <select
              id="station"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="border p-2 rounded w-full sm:w-64"
              required
            >
              <option value="">Select a Station</option>
              {allStations.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded sm:w-auto"
            required
          />

          <input
            id="time"
            type="time"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
            required
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search AQI
          </button>
        </form>
      </div>
    </div>
  );
}

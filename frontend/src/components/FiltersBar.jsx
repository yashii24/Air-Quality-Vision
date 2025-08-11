// FiltersBar.jsx
import React from "react";

export default function FiltersBar({
  query,
  setQuery,
  zoneFilter,
  setZoneFilter,
  zones = ["all"],
  categoryFilter,
  setCategoryFilter,
}) {
  const categories = ["all", "Good", "Moderate", "Poor", "Unhealthy", "Severe", "Hazardous"];

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
      <div className="flex-1 flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search station or zone..."
          className="w-full md:w-96 px-3 py-2 rounded-md border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="px-3 py-2 rounded-md border border-gray-200">
          {zones.map((z) => (
            <option key={z} value={z}>
              {z === "all" ? "All zones" : z}
            </option>
          ))}
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-md border border-gray-200">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => { setQuery(""); setZoneFilter("all"); setCategoryFilter("all"); }} className="text-sm px-3 py-1 rounded-md bg-gray-100">
          Reset
        </button>
      </div>
    </div>
  );
}

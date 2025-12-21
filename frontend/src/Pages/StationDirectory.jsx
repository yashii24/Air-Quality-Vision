// // StationDirectory.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import MiniStationCard from "../components/MiniStationCard";
// import FiltersBar from "../components/FiltersBar";
// import StationMap from "../components/StationMap";


// export default function StationDirectory({ apiUrl = "/api/locations", onStationClick }) {
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // filters state
//   const [query, setQuery] = useState("");
//   const [zoneFilter, setZoneFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [view, setView] = useState("list"); // 'list' | 'map'
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     fetch(apiUrl)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch stations");
//         return res.json();
//       })
//       .then((data) => {
//         if (!mounted) return;
//         setStations(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         if (!mounted) return;
//         setError(err.message);
//         setLoading(false);
//       });
//     return () => (mounted = false);
//   }, [apiUrl]);

//   const zones = useMemo(() => {
//     const zs = new Set();
//     stations.forEach((s) => s.zone && zs.add(s.zone));
//     return ["all", ...Array.from(zs)];
//   }, [stations]);

//   const filtered = useMemo(() => {
//     return stations
//       .filter((s) => {
//         if (zoneFilter !== "all" && (s.zone || "") !== zoneFilter) return false;
//         if (
//           query &&
//           !(`${s.name || s.station || ""} ${s.zone || ""}`
//             .toLowerCase()
//             .includes(query.toLowerCase()))
//         )
//           return false;
//         if (categoryFilter !== "all") {
//           const aqi =
//             s.realtime_aqi ??
//             s.aqi ??
//             s.calculated_indian_aqi ??
//             s.calculated_aqi ??
//             null;
//           const cat = getAQICategory(aqi);
//           if (cat !== categoryFilter) return false;
//         }
//         return true;
//       })
//       .sort((a, b) => {
//         const ai = a.realtime_aqi ?? a.aqi ?? a.calculated_aqi ?? 0;
//         const bi = b.realtime_aqi ?? b.aqi ?? b.calculated_aqi ?? 0;
//         return bi - ai;
//       });
//   }, [stations, query, zoneFilter, categoryFilter]);

//   const suggestions = useMemo(() => {
//     if (!query) return [];
//     return stations.filter((s) =>
//       (s.name || s.station || "")
//         .toLowerCase()
//         .includes(query.toLowerCase())
//     );
//   }, [stations, query]);

//   if (loading) return <div className="p-6">Loading stations…</div>;
//   if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import MiniStationCard from "../components/MiniStationCard";
import FiltersBar from "../components/FiltersBar";
import StationMap from "../components/StationMap";

export default function StationDirectory({ onStationClick }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [view, setView] = useState("list");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api
      .get("/api/locations")
      .then((res) => {
        if (!mounted) return;
        setStations(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to fetch stations");
        setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  const zones = useMemo(() => {
    const zs = new Set();
    stations.forEach((s) => s.zone && zs.add(s.zone));
    return ["all", ...Array.from(zs)];
  }, [stations]);

  const filtered = useMemo(() => {
    return stations
      .filter((s) => {
        if (zoneFilter !== "all" && (s.zone || "") !== zoneFilter)
          return false;
        if (
          query &&
          !(`${s.name || s.station || ""} ${s.zone || ""}`
            .toLowerCase()
            .includes(query.toLowerCase()))
        )
          return false;
        if (categoryFilter !== "all") {
          const aqi =
            s.realtime_aqi ??
            s.aqi ??
            s.calculated_indian_aqi ??
            s.calculated_aqi ??
            null;
          const cat = getAQICategory(aqi);
          if (cat !== categoryFilter) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ai = a.realtime_aqi ?? a.aqi ?? a.calculated_aqi ?? 0;
        const bi = b.realtime_aqi ?? b.aqi ?? b.calculated_aqi ?? 0;
        return bi - ai;
      });
  }, [stations, query, zoneFilter, categoryFilter]);

  const suggestions = useMemo(() => {
    if (!query) return [];
    return stations.filter((s) =>
      (s.name || s.station || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [stations, query]);

  if (loading) return <div className="p-6">Loading stations…</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Delhi Air Quality Stations</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 rounded-md ${
              view === "list"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("map")}
            className={`px-3 py-1 rounded-md ${
              view === "map"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Map
          </button>
        </div>
      </div>

      <div className="relative">
        <FiltersBar
          query={query}
          setQuery={(val) => {
            setQuery(val);
            setShowSuggestions(true);
          }}
          zoneFilter={zoneFilter}
          setZoneFilter={setZoneFilter}
          zones={zones}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-200 rounded-md mt-1 w-full z-10 max-h-60 overflow-y-auto shadow-md">
            {suggestions.map((s) => (
              <li
                key={s.name || s.station}
                onClick={() => {
                  setQuery(s.name || s.station);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {s.name || s.station}
              </li>
            ))}
          </ul>
        )}
      </div>

      {view === "map" ? (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <StationMap stations={filtered} onStationClick={onStationClick} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="text-gray-500 p-6">
              No stations match your filters.
            </div>
          ) : (
            filtered.map((s) => (
              <MiniStationCard
                key={s.name || s.station || s._id}
                station={s}
                onClick={() =>
                  onStationClick
                    ? onStationClick(s)
                    : window.location.assign(
                        `/data?station=${encodeURIComponent(
                          s.name || s.station || s._id
                        )}`
                      )
                }
              />
            ))
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <RankList stations={stations} type="clean" />
        <RankList stations={stations} type="polluted" />
      </div>
    </div>
  );
}

function getAQICategory(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) return "unknown";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Unhealthy";
  if (aqi <= 400) return "Severe";
  if (aqi <= 500) return "Hazardous";
  return "Unknown";
}

function RankList({ stations = [], type = "clean" }) {
  const list = [...stations].filter(Boolean);
  list.sort((a, b) => {
    const ai = a.realtime_aqi ?? a.aqi ?? a.calculated_aqi ?? 0;
    const bi = b.realtime_aqi ?? b.aqi ?? b.calculated_aqi ?? 0;
    return type === "clean" ? ai - bi : bi - ai;
  });
  const top = list.slice(0, 5);

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <h3 className="font-semibold mb-3">
        {type === "clean"
          ? "✅Top 5 Cleanest (latest)"
          : "⚠️Top 5 Most Polluted (latest)"}
      </h3>
      <div className="bg-gray-100 p-3 border rounded-lg border-gray-200">
              <ul className="space-y-2">
        {top.map((s) => (
          <li
            key={s.name || s.station || s._id}
            className="flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-medium">
                {s.name || s.station || "Unnamed Station"}
              </div>
              <div className="text-xs text-gray-500">
                {s.zone || "Delhi"}
              </div>
            </div>
            <div className="text-sm font-bold">
              {s.realtime_aqi ?? s.aqi ?? "—"}
            </div>
          </li>
        ))}
      </ul>
      </div>

    </div>
  );
}



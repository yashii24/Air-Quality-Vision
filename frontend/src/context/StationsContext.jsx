import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import api from "../services/api";

const StationsContext = createContext();

export function StationsProvider({ children }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // 1️⃣ Load from localStorage instantly
    const cached = localStorage.getItem("stationsList");
    if (cached) {
      setStations(JSON.parse(cached));
    }

    // 2️⃣ Fetch from API (background refresh)
    const fetchStations = async () => {
      try {
        const res = await api.get("/api/stations");

        if (res.data?.stations) {
          setStations(res.data.stations);
          localStorage.setItem(
            "stationsList",
            JSON.stringify(res.data.stations)
          );
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };

    fetchStations();
  }, []);

  return (
    <StationsContext.Provider value={{ stations }}>
      {children}
    </StationsContext.Provider>
  );
}

export function useStations() {
  return useContext(StationsContext);
}

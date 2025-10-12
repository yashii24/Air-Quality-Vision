import React from "react";

export default function AQICard({ data }) {
  if (!data) return null;

  const aqi =
    data.realtime_aqi ??
    data.aqi ??
    data.calculated_indian_aqi ??
    data.calculated_aqi ??
    null;
  const lastUpdated =
    data.time?.s ?? data.time ?? data.timestamp ?? "N/A";

  const getColor = (aqi) => {
    if (isNaN(aqi)) return "#9CA3AF";
    if (aqi <= 50) return "#2f855a"; // Good
    if (aqi <= 100) return "#8FB82B"; // Moderate
    if (aqi <= 200) return "#F6E05E"; // Poor
    if (aqi <= 300) return "#F59E0B"; // Unhealthy
    if (aqi <= 400) return "#B03A9E"; // Very Unhealthy
    if (aqi <= 500) return "#EF4444"; // Severe
    return "#7e0023"; // Hazardous
  };

  const getAQIStatus = (aqi) => {
    if (isNaN(aqi)) return "N/A";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Unhealthy";
    if (aqi <= 400) return "Very Unhealthy";
    if (aqi <= 500) return "Severe";
    return "Hazardous";
  };

  // AQI scale segments with proportional widths
  const aqiScale = [
    { label: "Good", color: "#2f855a", range: 50 },
    { label: "Moderate", color: "#8FB82B", range: 50 },
    { label: "Poor", color: "#F6E05E", range: 100 },
    { label: "Unhealthy", color: "#F59E0B", range: 100 },
    { label: "Very Unhealthy", color: "#B03A9E", range: 100 },
    { label: "Severe", color: "#EF4444", range: 100 },
    { label: "Hazardous", color: "#7e0023", range: 0 }, // extra >500
  ];

  // Position of pointer (cap at 500)
  const getAqiPosition = () => {
    if (isNaN(aqi)) return "0%";
    return `${Math.min((aqi / 500) * 100, 100)}%`;
  };

  const isLive =
    (data.source || "").toString().toLowerCase().includes("waqi") ||
    (data.realtime_aqi !== undefined && data.realtime_aqi !== null);

  return (
    <div className="h-full flex flex-col justify-between">
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
        Air Quality Overview
      </h2>

      {/* Card */}
      <div className="bg-gray-100 p-4 md:p-6 h-full flex flex-col justify-between border shadow-md">
        <div className="flex items-start justify-between ">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              AQI in <span className="font-bold">{data.station}</span>, Delhi
            </h3>

            {/* Live / Historical indicator */}
            <div className="mt-1">
              {isLive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    Live
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-gray-500">
                    Historical
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* AQI Status */}
          <div className="flex flex-col items-end">
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full text-white shadow-sm"
              style={{ backgroundColor: getColor(aqi) }}
            >
              {getAQIStatus(aqi)}
            </span>
            <p className="text-xs text-gray-400 mt-2">Air Quality</p>
          </div>
        </div>

        {/* AQI Number + Scale */}
        <div className="mt-4 md:mt-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-600">AQI</p>
              <div className="text-5xl md:text-7xl font-extrabold leading-none">
                {aqi ?? "N/A"}
              </div>
            </div>

            <div className="flex-1">
              {/* Colored proportional scale */}
              <div className="w-full mt-12 relative">
                <div className="flex w-full h-3 rounded-full overflow-hidden">
                  {aqiScale.map((s, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: s.color, width: `${(s.range / 500) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Pointer */}
                <div
                  className="absolute top-1/2 w-3 h-3 bg-white rounded-full ring-2 ring-gray-800"
                  style={{
                    left: getAqiPosition(),
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              {/* Proportional labels */}
              <div className="flex text-[11px] text-gray-400 mt-1 w-full">
                {[
                  { label: "0", width: (50 / 500) * 100 },
                  { label: "50", width: (50 / 500) * 100 },
                  { label: "100", width: (100 / 500) * 100 },
                  { label: "200", width: (100 / 500) * 100 },
                  { label: "300", width: (100 / 500) * 100 },
                  { label: "400", width: (100 / 500) * 100 },
                  { label: "500+", width: 2 },
                ].map((segment, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${segment.width}%` }}
                    className="flex justify-start"
                  >
                    <span>{segment.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <div>Last updated: {lastUpdated}</div>
          <div className="mt-1">
            Source: {isLive ? "WAQI" : "Central Pollution Control Board (CPCB)"}
          </div>
        </div>
      </div>
    </div>
  );
}
















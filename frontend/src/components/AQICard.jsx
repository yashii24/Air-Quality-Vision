import React from "react";

export default function AQICard({ data }) {
  if (!data) return null;

  const aqi = data.realtime_aqi ?? data.aqi ?? data.calculated_indian_aqi ?? data.calculated_aqi ?? null;
  const lastUpdated = data.time?.s ?? data.time ?? data.timestamp ?? "N/A";

  const getColor = (aqi) => {
    if (isNaN(aqi)) return "#9CA3AF";
    if (aqi <= 50) return "#2f855a";
    if (aqi <= 100) return "#8FB82B";
    if (aqi <= 200) return "#F6E05E";
    if (aqi <= 300) return "#F59E0B";
    if (aqi <= 400) return "#EF4444";
    if (aqi <= 500) return "#9B2C2C";
    return "#7e0023";
  };

  const getAQIStatus = (aqi) => {
    if (isNaN(aqi)) return "N/A";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Unhealthy";
    if (aqi <= 400) return "Severe";
    if (aqi <= 500) return "Hazardous";
    return "⚠️";
  };

  const aqiScale = [
    { label: "Good", color: "#2f855a" },
    { label: "Moderate", color: "#8FB82B" },
    { label: "Poor", color: "#F6E05E" },
    { label: "Unhealthy", color: "#F59E0B" },
    { label: "Severe", color: "#EF4444" },
    { label: "Hazardous", color: "#9B2C2C" },
  ];

  const getAqiPosition = () => {
    if (isNaN(aqi)) return "0%";
    return `${Math.min((aqi / 500) * 100, 100)}%`;
  };

  const isLive = (data.source || "").toString().toLowerCase().includes("waqi") || (data.realtime_aqi !== undefined && data.realtime_aqi !== null);

  return (
    <div className="h-full flex flex-col justify-between">
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">Air Quality Overview</h2>

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
                  <span className="text-xs font-medium text-green-600">Live</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 shadow-sm" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500">Historical</span>
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
              <div className="text-5xl md:text-7xl font-extrabold leading-none">{aqi ?? "N/A"}</div>
            </div>

            <div className="flex-1">
              <div className="w-full mt-12">
                <div className="relative h-3 rounded-full overflow-hidden">
                  <div className="flex w-full h-full rounded-full">
                    {aqiScale.map((s, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: s.color }} />
                    ))}
                  </div>

                  <div
                    className="absolute top-1/2 w-3 h-3 bg-white rounded-full ring-2 ring-gray-800 transform -translate-y-1/2"
                    style={{ left: getAqiPosition(), transform: "translate(-50%, -50%)" }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-400 mt-2">
                  <span>0</span>
                  <span>100</span>
                  <span>200</span>
                  <span>300</span>
                  <span>400</span>
                  <span>500</span>
                </div>
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





// import React from "react";

// export default function AQICard({ data }) {
//   if (!data) return null;

//   const aqi = data.realtime_aqi ?? data.aqi ?? data.calculated_indian_aqi ?? data.calculated_aqi ?? null;
//   const lastUpdated = data.time?.s ?? data.time ?? data.timestamp ?? "N/A";

//   const getColor = (aqi) => {
//     if (isNaN(aqi)) return "#9CA3AF";
//     if (aqi <= 50) return "#2f855a";        // green
//     if (aqi <= 100) return "#8FB82B";       // light green
//     if (aqi <= 200) return "#F6E05E";       // yellow
//     if (aqi <= 300) return "#F59E0B";       // orange
//     if (aqi <= 400) return "#EF4444";       // red
//     if (aqi <= 500) return "#9B2C2C";       // maroon
//     return "#7e0023";
//   };

//   const getAQIStatus = (aqi) => {
//     if (isNaN(aqi)) return "N/A";
//     if (aqi <= 50) return "Good";
//     if (aqi <= 100) return "Moderate";
//     if (aqi <= 200) return "Poor";
//     if (aqi <= 300) return "Unhealthy";
//     if (aqi <= 400) return "Severe";
//     if (aqi <= 500) return "Hazardous";
//     return "⚠️";
//   };

//   const aqiScale = [
//     { label: "Good", color: "#2f855a" },
//     { label: "Moderate", color: "#8FB82B" },
//     { label: "Poor", color: "#F6E05E" },
//     { label: "Unhealthy", color: "#F59E0B" },
//     { label: "Severe", color: "#EF4444" },
//     { label: "Hazardous", color: "#9B2C2C" },
//   ];

//   const getAqiPosition = () => {
//     if (isNaN(aqi)) return "0%";
//     return `${Math.min((aqi / 500) * 100, 100)}%`;
//   };

//   return (
//     <div className="h-full flex flex-col justify-between">
//       <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">Air Quality Overview</h2>
//       {/* Card content box (keeps same look as map card) */}
//       <div className=" bg-gray-100 p-4 md:p-6 h-full flex flex-col justify-between border border-gray-100 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <h3 className="text-lg md:text-xl font-semibold text-gray-800">
//               AQI in <span className="font-bold">{data.station}</span>, Delhi
//             </h3>
//             <p className="text-xs text-gray-500 mt-1">Location — {data.zone || "Pusa"}</p>
//           </div>

//           {/* small status pill */}
//           <div className="flex flex-col items-end">
//             <span
//               className="text-sm font-semibold px-3 py-1 rounded-full text-white shadow-sm"
//               style={{ backgroundColor: getColor(aqi) }}
//             >
//               {getAQIStatus(aqi)}
//             </span>
//             <p className="text-xs text-gray-400 mt-2">Air Quality is</p>
//           </div>
//         </div>

//         {/* AQI number + scale */}
//         <div className="mt-4 md:mt-6">
//           <div className="flex items-center gap-6">
//             <div>
//               <p className="text-sm text-gray-600">AQI</p>
//               <div className="text-5xl md:text-7xl font-extrabold leading-none">{aqi ?? "N/A"}</div>
//             </div>

//             {/* optional small sparkline placeholder */}
//             <div className="flex-1">
//               {/* Scale */}
//               <div className="w-full mt-12">
//                 <div className="relative h-3 rounded-full overflow-hidden">
//                   <div className="flex w-full h-full rounded-full">
//                     {aqiScale.map((s, i) => (
//                       <div key={i} className="flex-1" style={{ backgroundColor: s.color }} />
//                     ))}
//                   </div>

//                   {/* tiny pointer */}
//                   <div
//                     className="absolute top-1/2 w-3 h-3 bg-white rounded-full ring-2 ring-gray-800 transform -translate-y-1/2"
//                     style={{ left: getAqiPosition(), transform: "translate(-50%, -50%)" }}
//                   />
//                 </div>

//                 {/* scale labels */}
//                 <div className="flex justify-between text-[11px] text-gray-400 mt-2">
//                   <span>0</span>
//                   <span>100</span>
//                   <span>200</span>
//                   <span>300</span>
//                   <span>400</span>
//                   <span>500</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* footer meta */}
//         <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
//           <div>Last updated: {lastUpdated}</div>
//           <div className="mt-1">Source: {data.source || "WAQI / Historical"}</div>

//         </div>
//       </div>
//     </div>
//   );
// }













// import React from "react";

// export default function AQICard({ data }) {
//   if (!data) return null;

//   const aqi = data.realtime_aqi ?? data.aqi ?? data.calculated_indian_aqi ?? data.calculated_aqi ?? null;
//   const lastUpdated = data.time?.s ?? data.time ?? data.timestamp ?? "N/A";

//   const getColor = (aqi) => {
//     if (isNaN(aqi)) return "#999999";
//     if (aqi <= 50) return "#54a84f";
//     if (aqi <= 100) return "#a1c653";
//     if (aqi <= 200) return "#fef732";
//     if (aqi <= 300) return "#f19a32";
//     if (aqi <= 400) return "#e73e31";
//     if (aqi <= 500) return "#af2d24";
//     return "#7e0023";
//   };

//   const getAQIStatus = (aqi) => {
//     if (isNaN(aqi)) return "Fine";
//     if (aqi <= 50) return "Good";
//     if (aqi <= 100) return "Moderate";
//     if (aqi <= 200) return "Poor";
//     if (aqi <= 300) return "Unhealthy";
//     if (aqi <= 400) return "Severe";
//     if (aqi <= 500) return "Hazardous";
//     return "⚠️";
//   };

//   const aqiScale = [
//     { label: "Good", color: "#54a84f" },
//     { label: "Moderate", color: "#a1c653" },
//     { label: "Poor", color: "#fef732" },
//     { label: "Unhealthy", color: "#f19a32" },
//     { label: "Severe", color: "#e73e31" },
//     { label: "Hazardous", color: "#af2d24" },
//   ];

//   const getAqiPosition = () => {
//     if (isNaN(aqi)) return "0%";
//     return `${Math.min((aqi / 500) * 100, 100)}%`;
//   };

//   return (
//     <div className="rounded-2xl border-l-8 border-yellow-400 bg-white shadow-lg p-6 w-full h-full flex flex-col justify-between space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold text-gray-800 ">
//           Air Quality in <span className="font-bold">{data.station}</span>, Delhi, India
//         </h2>
//       </div>
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col justify-center">
//           <h2 className="text-xl font-bold">AQI:</h2>
//           <div className="text-6xl font-extrabold text-black">{aqi ?? "N/A"}</div>
//         </div>
        
//         <div className="text-center">
//           <p className="text-sm text-gray-600 font-medium">Air Quality is</p>
//           <div
//             className="text-black text-sm font-semibold px-3 py-1 rounded shadow-sm mt-1"
//             style={{ backgroundColor: getColor(aqi) }}
//           >
//             {getAQIStatus(aqi)}
//           </div>
//         </div>
//       </div>

//       {/* AQI Gradient Scale */}
//       <div className="relative h-4 rounded-full overflow-hidden">
//         <div className="flex w-full h-full">
//           {aqiScale.map((s, i) => (
//             <div key={i} className="flex-1" style={{ backgroundColor: s.color }} />
//           ))}
//         </div>
//         <div
//           className="absolute top-1/2 w-5 h-5 border-2 border-black bg-white rounded-full shadow"
//           style={{
//             left: getAqiPosition(),
//             transform: "translate(-50%, -50%)",
//           }}
//         />
//       </div>

//       {/* Meta Info */}
//       <div className="text-xs text-gray-500">
//         <p>Last updated: {lastUpdated}</p>
//         <p>Source: {data.source || "Historical"}</p>
//       </div>
//     </div>
//   );
// }


















// // src/components/AQICard.jsx
// import React, { useEffect, useState } from "react";

// export default function AQICard({ data }) {
//     if(!data) return null;
    
//     const aqi = data.realtime_aqi ?? data.aqi ?? data.calculated_indian_aqi ?? data.calculated_aqi ?? null;
//     const lastUpdated = data.time?.s ?? data.time ?? data.timestamp ?? 'N/A';

//   const getColor = (aqi) => {
//     if (isNaN(aqi)) return '#999999';
//         if (aqi <= 50) return '#54a84f';     
//         if (aqi <= 100) return '#a1c653';    
//         if (aqi <= 200) return '#fef732';   
//         if (aqi <= 300) return '#f19a32';    
//         if (aqi <= 400) return '#e73e31';    
//         if (aqi <= 500) return '#af2d24';  
//         return '#7e0023';
//   };

//   const getAQIStatus = (aqi) => {
//         if (isNaN(aqi)) return 'Fine';
//         if (aqi <= 50) return 'Good';     
//         if (aqi <= 100) return 'Moderate';    
//         if (aqi <= 200) return 'Poor';   
//         if (aqi <= 300) return 'Unhealthy';    
//         if (aqi <= 400) return 'Severe';    
//         if (aqi <= 500) return 'Hazardous';  
//         return '⚠️';                    
//     }

//     const aqiScale = [
//     { label: 'Good', color: '#54a84f' },
//     { label: 'Moderate', color: '#a1c653' },
//     { label: 'Poor', color: '#fef732' },
//     { label: 'Unhealthy', color: '#f19a32' },
//     { label: 'Severe', color: '#e73e31' },
//     { label: 'Hazardous', color: '#af2d24' },
//   ];

//   const getAqiPosition = () => {
//     if (isNaN(aqi)) return '0%';
//     return `${Math.min((aqi / 500) * 100, 100)}%`;
//   };

//   return (
//     <div className="rounded-xl border-4 shadow-xl p-7 max-w-md w-full bg-white border-yellow-400">
//       <h2 className="text-3xl font-bold text-black mb-14">
//         Air Quality in {data.station || "N/A"}, Delhi, India
//       </h2>

//       <div className="flex items-center justify-between mb-6">
//         <div className="text-6xl font-bold text-black">{aqi ?? 'N/A'}</div>
//         <div className="text-center">
//           <p className="text-sm font-semibold">Air Quality is</p>
//           <div
//             className="text-black text-lg font-bold px-3 py-1 rounded mt-1"
//             style={{ backgroundColor: getColor(aqi) }}
//           >
//             {getAQIStatus(aqi)}
//           </div>
//         </div>
//       </div>

//       {/* AQI Gradient Bar with Indicator */}
//       <div className="relative h-4 rounded-full overflow-hidden mb-14">
//         <div className="flex w-full h-full ">
//           {aqiScale.map((s, index) => (
//             <div
//               key={index}
//               className="flex-1"
//               style={{ backgroundColor: s.color }}
//             />
//           ))}
//         </div>
//         {/* AQI Pointer */}
//         <div
//           className="absolute -top-0 w-4 h-4 border-2 border-black bg-white rounded-full"
//           style={{ left: getAqiPosition(), transform: 'translateX(-50%)' }}
//         />
//       </div>

//       <p className="text-sm text-gray-600 mt-14">Last updated: {lastUpdated}</p>
//       <p className="text-sm text-gray-600">Source: {data.source || "Historical"}</p>
//     </div>
//   );
// }





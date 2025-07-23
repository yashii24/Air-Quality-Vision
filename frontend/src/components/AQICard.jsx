// src/components/AQICard.jsx
import React, { useEffect, useState } from "react";

export default function AQICard({ data }) {
    if(!data) return null;
    
    const aqi = data.realtime_aqi ?? data.aqi ?? data.calculated_indian_aqi ?? data.calculated_aqi ?? null;
    const lastUpdated = data.time?.s ?? data.time ?? data.timestamp ?? 'N/A';

  const getColor = (aqi) => {
    if (isNaN(aqi)) return '#999999';
        if (aqi <= 50) return '#54a84f';     
        if (aqi <= 100) return '#a1c653';    
        if (aqi <= 200) return '#fef732';   
        if (aqi <= 300) return '#f19a32';    
        if (aqi <= 400) return '#e73e31';    
        if (aqi <= 500) return '#af2d24';  
        return '#7e0023';
  };

  const getAQIStatus = (aqi) => {
        if (isNaN(aqi)) return 'Fine';
        if (aqi <= 50) return 'Good';     
        if (aqi <= 100) return 'Moderate';    
        if (aqi <= 200) return 'Poor';   
        if (aqi <= 300) return 'Unhealthy';    
        if (aqi <= 400) return 'Severe';    
        if (aqi <= 500) return 'Hazardous';  
        return '⚠️';                    
    }

    const aqiScale = [
    { label: 'Good', color: '#54a84f' },
    { label: 'Moderate', color: '#a1c653' },
    { label: 'Poor', color: '#fef732' },
    { label: 'Unhealthy', color: '#f19a32' },
    { label: 'Severe', color: '#e73e31' },
    { label: 'Hazardous', color: '#af2d24' },
  ];

  const getAqiPosition = () => {
    if (isNaN(aqi)) return '0%';
    return `${Math.min((aqi / 500) * 100, 100)}%`;
  };

  return (
    <div className="rounded-xl border-4 shadow-xl p-7 max-w-md w-full bg-white border-yellow-400">
      <h2 className="text-3xl font-bold text-black mb-14">
        Air Quality in {data.station || "N/A"}, Delhi, India
      </h2>

      <div className="flex items-center justify-between mb-6">
        <div className="text-6xl font-bold text-black">{aqi ?? 'N/A'}</div>
        <div className="text-center">
          <p className="text-sm font-semibold">Air Quality is</p>
          <div
            className="text-black text-lg font-bold px-3 py-1 rounded mt-1"
            style={{ backgroundColor: getColor(aqi) }}
          >
            {getAQIStatus(aqi)}
          </div>
        </div>
      </div>

      {/* AQI Gradient Bar with Indicator */}
      <div className="relative h-4 rounded-full overflow-hidden mb-14">
        <div className="flex w-full h-full ">
          {aqiScale.map((s, index) => (
            <div
              key={index}
              className="flex-1"
              style={{ backgroundColor: s.color }}
            />
          ))}
        </div>
        {/* AQI Pointer */}
        <div
          className="absolute -top-0 w-4 h-4 border-2 border-black bg-white rounded-full"
          style={{ left: getAqiPosition(), transform: 'translateX(-50%)' }}
        />
      </div>

      <p className="text-sm text-gray-600 mt-14">Last updated: {lastUpdated}</p>
      <p className="text-sm text-gray-600">Source: {data.source || "Historical"}</p>
    </div>
  );
}





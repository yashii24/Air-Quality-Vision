import React from 'react';
import { IoStatsChart } from 'react-icons/io5';
import { WiDaySunny } from 'react-icons/wi';
import { FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';
import { RiRadarLine } from 'react-icons/ri';
import { MdInsights } from 'react-icons/md';
import { AiOutlineInfoCircle } from 'react-icons/ai';

const navItems = [
  { label: 'Air Quality', icon: WiDaySunny },
  { label: 'Monitoring',  icon: IoStatsChart },
  { label: 'Real‑time Data',   icon: RiRadarLine },
    { label: 'Predicted Data',  icon: FaChartLine },
  { label: 'Station',     icon: FaMapMarkerAlt },
  { label: 'Insights',    icon: MdInsights },
  { label: 'Tips',        icon: AiOutlineInfoCircle },
];

export default function EnvironmentSection() {
  return (
    <div className="mx-20 px-4 py-10">
      <h3 className="pt-10 text-3xl text-center pl-10 font-bold mb-4">In our environment</h3>
      <div className="flex flex-wrap gap-6 justify-center">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              <Icon size={32} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

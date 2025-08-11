import { AlertTriangle, Wind, Cloud, Sun, Droplets, Thermometer } from 'lucide-react';

const pollutants = [
  { name: 'PM2.5', desc: 'Fine inhalable particles with diameters of 2.5 micrometers or less.', icon: <Wind /> },
  { name: 'PM10', desc: 'Inhalable particles with diameters of 10 micrometers or less.', icon: <Cloud /> },
  { name: 'NO₂', desc: 'Emitted from vehicles and power plants. Causes respiratory issues.', icon: <Droplets /> },
  { name: 'O₃', desc: 'Ground-level ozone formed by chemical reactions in sunlight.', icon: <Sun /> },
  { name: 'CO', desc: 'Carbon monoxide from incomplete combustion, harmful in high concentrations.', icon: <Thermometer /> },
  { name: 'SO₂', desc: 'Sulfur dioxide mainly comes from burning fossil fuels and can cause respiratory problems.', icon: <AlertTriangle />},
];

export default function EducationalSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#f4f8fb] to-[#d3d6d8] text-gray-800" id="learn">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Understanding Air Quality</h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Learn what AQI means, how it's calculated, and how different pollutants affect your health.
        </p>

        {/* What is AQI Section */}
<div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
  <h3 className="text-3xl font-bold mb-4 text-center text-black">What is AQI?</h3>
  <p className="text-gray-700 text-lg text-center max-w-4xl mx-auto">
    The Air Quality Index (AQI) is a standardized tool used to communicate how polluted the air currently is or how polluted it is forecast to become. The AQI converts complex air quality data of various pollutants into a single number and color code that helps people understand the health effects of air pollution.
  </p>

  <div className="mt-10 grid gap-6 md:grid-cols-3">
    <div className="bg-gray-100 p-6 rounded-xl shadow text-center hover:shadow-md transition">
      <h4 className="text-xl font-semibold mb-2 text-black">How is AQI Calculated?</h4>
      <p className="text-gray-600 text-sm">
        AQI is calculated based on concentrations of key pollutants like PM2.5, PM10, NO₂, SO₂, CO, and O₃. The highest individual pollutant index becomes the overall AQI.
      </p>
    </div>
    <div className="bg-gray-100 p-6 rounded-xl shadow text-center hover:shadow-md transition">
      <h4 className="text-xl font-semibold mb-2 text-black">Why is AQI Important?</h4>
      <p className="text-gray-600 text-sm">
        AQI helps people, especially those with health conditions, plan outdoor activities safely by understanding when air quality poses health risks.
      </p>
    </div>
    <div className="bg-gray-100 p-6 rounded-xl shadow text-center hover:shadow-md transition">
      <h4 className="text-xl font-semibold mb-2 text-black">Who Uses AQI?</h4>
      <p className="text-gray-600 text-sm">
        Governments, health agencies, and apps use AQI to issue warnings, policy decisions, and public health advisories based on pollution levels.
      </p>
    </div>
  </div>
</div>


        {/* Pollutant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pollutants.map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6 transition hover:shadow-xl hover:scale-105 duration-300"
            >
              <div className="flex items-center gap-4 mb-4 text-black-600">
                <div className="bg-gray-100 p-3 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
              </div>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* AQI Scale */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-4 text-center">AQI Scale</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 text-white font-medium text-sm">
            {[
              { label: 'Good', color: 'bg-green-500', range: '0–50' },
              { label: 'Moderate', color: 'bg-yellow-400', range: '51–100' },
              { label: 'Unhealthy for Sensitive', color: 'bg-orange-400', range: '101–150' },
              { label: 'Unhealthy', color: 'bg-red-500', range: '151–200' },
              { label: 'Very Unhealthy', color: 'bg-purple-600', range: '201–300' },
              { label: 'Hazardous', color: 'bg-rose-900', range: '301+' },
            ].map((level, i) => (
              <div key={i} className={`rounded-lg px-3 py-2 ${level.color}`}>
                <span className="block text-xs">{level.label}</span>
                <span>{level.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className="mt-16 bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
          <h4 className="text-xl font-bold mb-2">Stay Safe</h4>
          <p className="text-gray-600">
            If AQI is above 150, avoid outdoor activities and wear an N95 mask. Sensitive groups should be extra cautious.
          </p>
        </div>
      </div>
    </section>
  );
}

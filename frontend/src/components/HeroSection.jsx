import React from 'react'
import HeroImage from '../assets/HeroImage.jpg'
import { Link } from 'react-router-dom'


const HeroSection = () => {
  return (
    <section className="w-full bg-gray-100 px-[10rem] py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-lg">
            <h2 className="text-6xl font-bold mb-8">AQI Insights</h2>
            <p className="text-lg mb-8">Your guide to real-time AQI data</p>
            <div className="flex gap-4">
                <Link to="/home" className="bg-black text-white px-4 py-2 rounded">View Data</Link>
                <Link to="/StationDirectory" className="bg-white border px-4 py-2 rounded">Stations</Link>
            </div>
        </div>
        <div className="mt-8 md:mt-0">
            <img src={HeroImage} alt="AQI View" className="rounded-3xl w-full max-w-xl" />
        </div>
    </section>
  )
}

export default HeroSection

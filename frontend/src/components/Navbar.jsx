// src/components/Header.jsx
import React from "react";
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="w-full bg-black shadow-md py-4 px-[10rem] flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-white">Air Quality Vision</Link>
      
      <nav className="space-x-6 hidden md:flex items-center">
        <Link to="/" className="text-white hover:text-gray-300 transition">Home</Link>
        <Link to="/home" className="text-white hover:text-gray-300 transition">Data</Link>
        <Link to="/StationDirectory" className="text-white hover:text-gray-300 transition">Stations</Link>
        <Link to="/contact" className="text-white hover:text-gray-300 transition">Contact Us</Link>
      </nav>

    </header>
  );
}

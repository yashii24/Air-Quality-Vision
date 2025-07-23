// src/components/Header.jsx
import React from "react";
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="w-full bg-gray-100 shadow-md py-4 px-[10rem] flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-black">Air Quality Vision</Link>
      
      <nav className="space-x-6 hidden md:flex">
        <Link to="/" className="text-gray-900 hover:underline">Home</Link>
        <Link to="/home" className="text-gray-900 hover:underline">Data</Link>
        <Link to="/stations" className="text-gray-900 hover:underline">Stations</Link>
        <Link to="/contact" className="text-gray-900 hover:underline">Contact Us</Link>
      </nav>

    </header>
  );
}

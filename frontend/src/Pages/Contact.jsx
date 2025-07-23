import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-gray-300 to-white py-16 px-6 md:px-12 lg:px-24 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black-800">Get in Touch</h2>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Have questions, suggestions, or feedback about our AQI project? We'd love to hear from you.
        </p>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-1 gap-12 mx-40">
        {/* Contact Form */}
        <form className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message here..."
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6 text-gray-600">
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-black" />
            <p>New Delhi, India</p>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-black" />
            <p>+91 9876543210</p>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-black" />
            <p>support@aqi-tracker.com</p>
          </div>

          <div className="mt-10">
            <h4 className="text-xl font-bold mb-2 text-black">Working Hours</h4>
            <p className="text-gray-600">Mon – Fri: 9:00 AM – 6:00 PM</p>
            <p className="text-gray-600">Closed on weekends and public holidays.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

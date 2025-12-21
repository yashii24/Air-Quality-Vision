import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import api from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await api.post("/api/contact", formData);

      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-300 to-white py-16 px-6 md:px-12 lg:px-24 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black">Get in Touch</h2>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Have questions, suggestions, or feedback about our AQI project? We'd
          love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-1 gap-12 mx-40">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
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

          {status && (
            <p className="mt-4 text-center text-gray-700">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;

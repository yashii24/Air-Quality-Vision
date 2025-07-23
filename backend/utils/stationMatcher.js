const Fuse = require("fuse.js");

// ✅ Clean and standardize input
function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, "").trim();
}

const stationNames = [
  "Alipur",
  "Anand Vihar",
  "Ashok Vihar",
  "Aya Nagar",
  "Bawana",
  "Burari Crossing",
  "CRRI Mathura Road",
  "Chandni Chowk",
  "DTU",
  "Dwarka-Sector 8",
  "Dr. Karni Singh Shooting Range",
  "IGI Airport (T3)",
  "IHBAS, Dilshad Garden",
  "ITO",
  "Jahangirpuri",
  "Jawaharlal Nehru Stadium",
  "Lodhi Road IMD",
  "Lodhi Road, Delhi",
  "Mandir Marg",
  "Major Dhyan Chand National Stadium",
  "Mundka",
  "NSIT Dwarka",
  "Najafgarh",
  "Narela",
  "Nehru Nagar",
  "North Campus",
  "Okhla Phase-2",
  "Patparganj",
  "Punjabi Bagh",
  "Pusa",
  "Pusa, Delhi - IMD",
  "R K Puram",
  "Rohini",
  "Shadipur",
  "Sirifort",
  "Sonia Vihar",
  "Sri Aurobindo Marg",
  "Wazirpur"
];

// 📦 Fuse.js for fuzzy fallback
const fuse = new Fuse(stationNames, {
  includeScore: true,
  threshold: 0.4,
});

function matchStationName(userInput) {
  const normalizedInput = normalize(userInput);

  // ✅ Try exact normalized match
  for (const station of stationNames) {
    if (normalize(station) === normalizedInput) {
      return station;
    }
  }

  // 🔁 Try fuzzy fallback
  const result = fuse.search(userInput);
  if (result.length > 0) {
    return result[0].item;
  }

  return null; // ❌ Not found
}

module.exports = { matchStationName };



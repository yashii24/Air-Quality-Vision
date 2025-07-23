const stationNameMap = {
  "alipur": "Alipur",
  "alipur station": "Alipur",
  "alipur monitoring station": "Alipur",
  "anand vihar": "Anand Vihar",
  "anand ": "Anand Vihar",
  "Anand": "Anand Vihar",
  "Ashok" : "Ashok Vihar",
  "Aya":"Aya Nagar",
  "Burari": "Burari Crossing",
  "burari": "Burari Crossing",
  "burari crossing": "Burari Crossing",
  "CRRI" : "CRRI Mathura Road",
  "Chandni": "Chandni Chowk",
  "Dr." : "Dr. Karni Singh Shooting Range",
  "Dwarka Sector" : "Dwarka-Sector8",
  "IGI": "IGI Airport (T3)0",
  "IHBAS" :  "IHBAS, Dilshad Garden",
  "Jawaharlal" : "Jawaharlal Nehru Stadium",
  "Major":"Major Dhyan Chand National Stadium",
  "Lodhi" : "Lodhi Road IMD",
  "Mandir":"Mandir Marg",
  "mandir marg": "Mandir Marg",
  "NSIT" : "NSIT Dwarka",
  "Nehru" : "Nehru Nagar",
  "North" : "North Campus",
  "Okhla" : "Okhla Phase-2",
  "Punjabi" :"Punjabi Bagh",
  "punjabi bagh": "Punjabi Bagh",
  "R":"R K Puram",
  "ashok vihar": "Ashok Vihar",
  "siri fort": "Sirifort",
  "Sonia" : "Sonia Vihar",
  "r.k. puram": "R.K. Puram",
  "Sri" : "Sri Aurobindo Marg",
  // Add all your known stations and their variants here
};

/**
 * Sanitizes and maps the given station name to a consistent format.
 * @param {string} name - The station name to sanitize.
 * @returns {string} The standardized full station name.
 */
function sanitizeStationName(name) {
  if (!name || typeof name !== "string") return "";
  const key = name.trim().toLowerCase();
  return stationNameMap[key] || name.trim();
}

module.exports = { sanitizeStationName };

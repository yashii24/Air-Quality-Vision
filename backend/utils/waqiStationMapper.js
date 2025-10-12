const waqiStationMap = {
  "Anand Vihar": "delhi/anand-vihar",//w
  "Burari Crossing": "delhi/burari-crossing",//w
  "Alipur": "delhi/alipur",//w
  "Ashok Vihar": "delhi/satyawati-college",
  "Aya Nagar": "delhi/aya-nagar",//w
  "Bawana": "delhi/pooth-khurd--bawana",//
  "CRRI Mathura Road": "delhi/crri-mathura-road",//
  "Chandni Chowk": "delhi/chandni-chowk",
  "DTU": "delhi/dtu",//w
  "Dwarka-Sector 8": "delhi//national-institute-of-malaria-research--sector-8--dwarka",//
  "Dr. Karni Singh Shooting Range": "delhi/dr.-karni-singh-shooting-range",//
  "IGI Airport (T3)": "delhi/igi-airport-terminal-3",//w
  "IHBAS, Dilshad Garden": "delhi/ihbas",
  "ITO": "delhi/ito",
  "Jahangirpuri": "delhi/iti-jahangirpuri",//
  "Jawaharlal Nehru Stadium": "delhi/jawaharlal-nehru-stadium",//w
  "Lodhi Road IMD": "delhi/lodhi-road",//w
  "Mandir Marg": "delhi/mandir-marg",//w
  "Major Dhyan Chand National Stadium" : "delhi/major-dhyan-chand-national-stadium",//w
  "Mundka": "delhi/mundka",//w
  "NSIT Dwarka": "delhi/nsit-dwarka",
  "Najafgarh": "delhi//bramprakash-ayurvedic-hospital--najafgarh",//w
  "Narela": "delhi/narela",//w
  "Nehru Nagar": "delhi/pgdav-college",
  "North Campus": "delhi/north-campus",//w
  "Okhla Phase-2": "delhi/dite-okhla",//w
  "Patparganj": "delhi/mother-dairy-plant--parparganj",//w
  "Punjabi Bagh": "delhi/punjabi-bagh",//w
  "Pusa": "delhi/pusa",//w
  "R K Puram": "delhi/r.k.-puram",//w
  "Rohini": "delhi/shaheed-sukhdev-college-of-business-studies--rohini",//w
  "Shadipur": "delhi/shadipur",
  "Sirifort": "delhi/sirifort",//w
  "Sonia Vihar": "delhi/sonia-vihar-water-treatment-plant-djb",//w
  "Sri Aurobindo Marg": "delhi/sri-auribindo-marg",//w
  "Vivek Vihar": "delhi/iti-shahdra",
  "Wazirpur": "delhi/delhi-institute-of-tool-engineering--wazirpur"//w
};

function getWAQIStationName(localName) {
  return waqiStationMap[localName] || localName;
}

module.exports = { getWAQIStationName, waqiStationMap };

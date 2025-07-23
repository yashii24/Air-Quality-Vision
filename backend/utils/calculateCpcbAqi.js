// utils/cpcbAqiCalculator.js

const breakpoints = {
  pm25: [
    { Cp_lo: 0, Cp_hi: 30, I_lo: 0, I_hi: 50 },
    { Cp_lo: 31, Cp_hi: 60, I_lo: 51, I_hi: 100 },
    { Cp_lo: 61, Cp_hi: 90, I_lo: 101, I_hi: 200 },
    { Cp_lo: 91, Cp_hi: 120, I_lo: 201, I_hi: 300 },
    { Cp_lo: 121, Cp_hi: 250, I_lo: 301, I_hi: 400 },
    { Cp_lo: 251, Cp_hi: 500, I_lo: 401, I_hi: 500 },
  ],
  pm10: [
    { Cp_lo: 0, Cp_hi: 50, I_lo: 0, I_hi: 50 },
    { Cp_lo: 51, Cp_hi: 100, I_lo: 51, I_hi: 100 },
    { Cp_lo: 101, Cp_hi: 250, I_lo: 101, I_hi: 200 },
    { Cp_lo: 251, Cp_hi: 350, I_lo: 201, I_hi: 300 },
    { Cp_lo: 351, Cp_hi: 430, I_lo: 301, I_hi: 400 },
    { Cp_lo: 431, Cp_hi: 600, I_lo: 401, I_hi: 500 },
  ],
  no2: [
    { Cp_lo: 0, Cp_hi: 40, I_lo: 0, I_hi: 50 },
    { Cp_lo: 41, Cp_hi: 80, I_lo: 51, I_hi: 100 },
    { Cp_lo: 81, Cp_hi: 180, I_lo: 101, I_hi: 200 },
    { Cp_lo: 181, Cp_hi: 280, I_lo: 201, I_hi: 300 },
    { Cp_lo: 281, Cp_hi: 400, I_lo: 301, I_hi: 400 },
    { Cp_lo: 401, Cp_hi: 600, I_lo: 401, I_hi: 500 },
  ],
  o3: [
    { Cp_lo: 0, Cp_hi: 50, I_lo: 0, I_hi: 50 },
    { Cp_lo: 51, Cp_hi: 100, I_lo: 51, I_hi: 100 },
    { Cp_lo: 101, Cp_hi: 168, I_lo: 101, I_hi: 200 },
    { Cp_lo: 169, Cp_hi: 208, I_lo: 201, I_hi: 300 },
    { Cp_lo: 209, Cp_hi: 748, I_lo: 301, I_hi: 400 },
    { Cp_lo: 749, Cp_hi: 1000, I_lo: 401, I_hi: 500 },
  ],
  co: [
    { Cp_lo: 0, Cp_hi: 1.0, I_lo: 0, I_hi: 50 },
    { Cp_lo: 1.1, Cp_hi: 2.0, I_lo: 51, I_hi: 100 },
    { Cp_lo: 2.1, Cp_hi: 10, I_lo: 101, I_hi: 200 },
    { Cp_lo: 10.1, Cp_hi: 17, I_lo: 201, I_hi: 300 },
    { Cp_lo: 17.1, Cp_hi: 34, I_lo: 301, I_hi: 400 },
    { Cp_lo: 34.1, Cp_hi: 50, I_lo: 401, I_hi: 500 },
  ],
  so2: [
    { Cp_lo: 0, Cp_hi: 40, I_lo: 0, I_hi: 50 },
    { Cp_lo: 41, Cp_hi: 80, I_lo: 51, I_hi: 100 },
    { Cp_lo: 81, Cp_hi: 380, I_lo: 101, I_hi: 200 },
    { Cp_lo: 381, Cp_hi: 800, I_lo: 201, I_hi: 300 },
    { Cp_lo: 801, Cp_hi: 1600, I_lo: 301, I_hi: 400 },
    { Cp_lo: 1601, Cp_hi: 3000, I_lo: 401, I_hi: 500 },
  ],
  nh3: [
    { Cp_lo: 0, Cp_hi: 200, I_lo: 0, I_hi: 50 },
    { Cp_lo: 201, Cp_hi: 400, I_lo: 51, I_hi: 100 },
    { Cp_lo: 401, Cp_hi: 800, I_lo: 101, I_hi: 200 },
    { Cp_lo: 801, Cp_hi: 1200, I_lo: 201, I_hi: 300 },
    { Cp_lo: 1201, Cp_hi: 1800, I_lo: 301, I_hi: 400 },
    { Cp_lo: 1801, Cp_hi: 2400, I_lo: 401, I_hi: 500 },
  ]
};

function calcSubIndex(pollutant, Cp) {
  if (typeof Cp !== 'number' || isNaN(Cp)) {
    throw new Error(`Invalid concentration value for ${pollutant}: ${Cp}`);
  }

  const table = breakpoints[pollutant.toLowerCase()];
  if (!table) {
    throw new Error(`Unsupported pollutant: ${pollutant}`);
  }

  const row = table.find(r => Cp >= r.Cp_lo && Cp <= r.Cp_hi);
  if (!row) return null;

  const { Cp_lo, Cp_hi, I_lo, I_hi } = row;
  return ((I_hi - I_lo) / (Cp_hi - Cp_lo)) * (Cp - Cp_lo) + I_lo;
}

function calculateCpcbAqi(conc) {
  if (!conc || typeof conc !== 'object') {
    throw new Error("Pollutant concentrations must be an object");
  }

  // Convert keys to lowercase for case-insensitive matching
  const normalizedConc = {};
  Object.entries(conc).forEach(([key, value]) => {
    normalizedConc[key.toLowerCase()] = value;
  });

  // Required pollutants for Indian AQI calculation
  const requiredPollutants = ['pm25', 'pm10'];
  const optionalPollutants = ['no2', 'so2', 'o3', 'co', 'nh3'];
  
  // Check minimum data requirements
  const hasMinimumData = requiredPollutants.some(p => 
    normalizedConc[p] !== undefined && 
    normalizedConc[p] !== null && 
    !isNaN(normalizedConc[p])
  );

  if (!hasMinimumData) {
    throw new Error("Insufficient pollutant data (need at least PM2.5 or PM10 with valid values)");
  }

  // Calculate sub-indices for all available pollutants
  const subIndices = [...requiredPollutants, ...optionalPollutants]
    .filter(p => normalizedConc[p] !== undefined && normalizedConc[p] !== null)
    .map(pollutant => {
      try {
        let value = normalizedConc[pollutant];
        // Convert CO from mg/m³ to µg/m³ if needed
        if (pollutant === 'co' && value < 100) { // Assuming values >100 are already in µg/m³
          value = value * 1000;
        }
        const si = calcSubIndex(pollutant, value);
        return si !== null ? { pollutant, si } : null;
      } catch (err) {
        console.warn(`Error calculating sub-index for ${pollutant}:`, err.message);
        return null;
      }
    })
    .filter(x => x !== null);

  if (subIndices.length === 0) {
    throw new Error("No valid pollutant values provided");
  }

  // Find dominant pollutant (maximum sub-index)
  const maxEntry = subIndices.reduce((max, current) => 
    current.si > max.si ? current : max
  );

  return {
    aqi: Math.round(maxEntry.si),
    dominant: maxEntry.pollutant.toUpperCase(),
    allSubIndices: subIndices // For debugging purposes
  };
}

module.exports = { calculateCpcbAqi };


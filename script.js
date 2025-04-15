const map = L.map('map').setView([20, 0], 2); // World view
// Add hardcoded markers visible to all users
addMarker(34.0522, -118.2437, 'hateSpeech', 'Example Hate Speech in Los Angeles');
addMarker(40.7128, -74.0060, 'rumor', 'Example Rumor in New York');
addMarker(51.5074, -0.1278, 'alert', 'Yellow Alert in London');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Config
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1A-xAljWai7YIiVzf4Yec-thvR9WokRt8yQnpJiw3iGOTbYDJez51tcQqHmTdhPkzCBXutNJkVk0-/pub?gid=0&single=true&output=csv';
const OPENCAGE_API_KEY = '33bc15e34bc44677836917ce771d2a55';

// Function to geocode location using OpenCage
async function geocodeLocation(locationName) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${OPENCAGE_API_KEY}&limit=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.length > 0) {
      return data.results[0].geometry;
    } else {
      console.warn('No results for:', locationName);
      return null;
    }
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
}

// Load CSV and map data
Papa.parse(CSV_URL, {
  download: true,
  header: true,
  complete: async function (results) {
    const reports = results.data;

    for (const report of reports) {
      const location = report.Location || report.location;
      const description = report.Description || report.description;
      const category = report.Category || report.category || "Uncategorized";

      if (!location) continue;

      const coords = await geocodeLocation(location);

      if (coords) {
        const circle = L.circle([coords.lat, coords.lng], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 30000
        }).addTo(map);

        circle.bindPopup(`
          <strong>Category:</strong> ${category}<br>
          <strong>Location:</strong> ${location}<br>
          <strong>Description:</strong> ${description}
        `);
      }
    }
  }
});

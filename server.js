require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const OPEN_CAGE_API_KEY = process.env.OPEN_CAGE_API_KEY; // Access the API key from .env

app.use(express.json()); // Middleware to parse JSON requests

// Geocode API Endpoint
app.get('/api/geocode', async (req, res) => {
  const query = req.query.query; // Get the location query from the request
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Make a request to the OpenCage API
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPEN_CAGE_API_KEY}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      res.json(data); // Send the geocode data back to the frontend
    } else {
      res.status(404).json({ error: 'No results found' });
    }
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function searchLocation() {
  const searchQuery = document.getElementById('searchLocation').value.trim();
  if (!searchQuery) {
    alert('Please enter a location to search.');
    return;
  }

  // Call the backend API instead of the OpenCage API directly
  fetch(`/api/geocode?query=${encodeURIComponent(searchQuery)}`)
    .then(response => response.json())
    .then(data => {
      const geo = data.results[0]?.geometry;
      if (!geo) {
        alert('Could not find the location.');
        return;
      }

      // Center the map on the searched location
      map.setView([geo.lat, geo.lng], 10);
    })
    .catch(err => {
      console.error('Error searching location:', err);
      alert('An error occurred while searching for the location.');
    });
}

function showLocationSuggestions() {
  const query = document.getElementById('location').value.trim();
  const suggestionsList = document.getElementById('locationSuggestions');

  if (!query) {
    suggestionsList.style.display = 'none';
    return;
  }

  // Call the backend API instead of the OpenCage API directly
  fetch(`/api/geocode?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      const suggestions = data.results.map(result => result.formatted);
      suggestionsList.innerHTML = '';

      if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
          const li = document.createElement('li');
          li.textContent = suggestion;
          li.style.padding = '10px';
          li.style.cursor = 'pointer';
          li.addEventListener('click', () => {
            document.getElementById('location').value = suggestion;
            suggestionsList.style.display = 'none';
          });
          suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = 'block';
      } else {
        suggestionsList.style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Error fetching location suggestions:', err);
      suggestionsList.style.display = 'none';
    });
}

const PORT = 3000; // You can change the port if needed

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

});
});  console.log(`Server is running on port ${PORT}`);app.listen(PORT, () => {const PORT = 3000; // You can change the port if needed// Start the server}    });      suggestionsList.style.display = 'none';      console.error('Error fetching suggestions:', err);    .catch(err => {    })      }        suggestionsList.style.display = 'none';      } else {        suggestionsList.style.display = 'block';        });          suggestionsList.appendChild(li);          });            suggestionsList.style.display = 'none';            document.getElementById('searchLocation').value = suggestion;          li.addEventListener('click', () => {          li.style.cursor = 'pointer';          li.style.padding = '10px';          li.textContent = suggestion;          const li = document.createElement('li');        suggestions.forEach(suggestion => {      if (suggestions.length > 0) {      suggestionsList.innerHTML = '';      const suggestions = data.results.map(result => result.formatted);    .then(data => {    .then(response => response.json())  fetch(`/api/geocode?query=${encodeURIComponent(query)}`)  // Call the backend API instead of the OpenCage API directly  }    return;    suggestionsList.style.display = 'none';  if (!query) {  console.log(`Server is running on http://localhost:${PORT}`);
});
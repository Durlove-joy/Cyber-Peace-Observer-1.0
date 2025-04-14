require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const app = express();

const OPEN_CAGE_API_KEY = process.env.OPEN_CAGE_API_KEY; // Access the API key from .env

app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cyberpeace', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for reports
const reportSchema = new mongoose.Schema({
  issueType: String,
  subType: String,
  location: String,
  description: String,
  email: String,
  lat: Number,
  lon: Number,
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// Endpoint to save a report
app.post('/api/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json({ message: 'Report saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Endpoint to get all reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

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

  // Call the backend API
  fetch(`/api/geocode?query=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      return response.json();
    })
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

function showSuggestions() {
  const query = document.getElementById('searchLocation').value.trim();
  const suggestionsList = document.getElementById('suggestions');

  if (!query) {
    suggestionsList.style.display = 'none';
    return;
  }

  // Call the backend API
  fetch(`/api/geocode?query=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      return response.json();
    })
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
            document.getElementById('searchLocation').value = suggestion;
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
      console.error('Error fetching suggestions:', err);
      suggestionsList.style.display = 'none';
    });
}

function submitReport() {
  const issueType = document.getElementById('issueType').value;
  const subType = document.getElementById('subType').value;
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!issueType || !subType || !location || !description || !email) {
    alert("Please fill in all fields.");
    return;
  }

  // Call the backend API to get geocode data
  fetch(`/api/geocode?query=${encodeURIComponent(location)}`)
    .then(response => response.json())
    .then(data => {
      const geo = data.results[0]?.geometry;
      if (!geo) {
        alert("Could not find the location.");
        return;
      }

      const report = {
        issueType,
        subType,
        location,
        description,
        email,
        lat: geo.lat,
        lon: geo.lng
      };

      // Save the report in localStorage
      const reports = JSON.parse(localStorage.getItem("reports") || "[]");
      reports.push(report);
      localStorage.setItem("reports", JSON.stringify(reports));

      // Add a marker to the map
      addMarker(geo.lat, geo.lng, issueType, description);

      // Clear the form
      document.getElementById('issueType').value = '';
      document.getElementById('subType').value = '';
      document.getElementById('location').value = '';
      document.getElementById('description').value = '';
      document.getElementById('email').value = '';
    })
    .catch(err => {
      console.error('Error submitting report:', err);
      alert('An error occurred while submitting the report.');
    });
}

// On page load, load saved reports from the backend
fetch('/api/reports')
  .then(response => response.json())
  .then(reports => {
    reports.forEach(r => addMarker(r.lat, r.lon, `${r.issueType} - ${r.subType}`, r.description));
  })
  .catch(err => {
    console.error('Error loading reports:', err);
  });

const PORT = 3000; // You can change the port if needed

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
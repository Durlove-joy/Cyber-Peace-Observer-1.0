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

// Start the server
const PORT = 3000; // You can change the port if needed
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
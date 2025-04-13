const express = require('express');
const fetch = require('node-fetch');
const app = express();

const OPEN_CAGE_API_KEY = process.env.OPEN_CAGE_API_KEY;
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

app.use(express.json());

// Geocode API Endpoint
app.get('/api/geocode', async (req, res) => {
  const query = req.query.query;
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPEN_CAGE_API_KEY}`);
  const data = await response.json();
  res.json(data);
});

// EmailJS API Endpoint
app.post('/api/send-email', async (req, res) => {
  const { issueType, subType, location, description, email } = req.body;

  const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: { issueType, subType, location, description, email }
    })
  });

  res.json(await emailResponse.json());
});

app.listen(3000, () => console.log('Server running on port 3000'));

// Environment variables
OPEN_CAGE_API_KEY=YOUR_OPENCAGE_API_KEY
EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
// netlify/apiProxy/home.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const response = await fetch('https://goonbackend.onrender.com/home'); // Ensure backend URL is correct
    if (!response.ok) {
      console.error('Failed to fetch data:', response.status);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch data from backend' }),
      };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error during request' }),
    };
  }
};

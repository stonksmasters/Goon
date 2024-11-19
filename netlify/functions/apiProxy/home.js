// netlify/functions/apiProxy/home.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // Make the request to your backend API
    const response = await fetch('https://goonbackend.onrender.com/home'); // Ensure backend URL is correct

    if (!response.ok) {
      console.error('Failed to fetch data:', response.status);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch data from backend' }),
      };
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Error during request:', err);

    // Return a 500 status code if something went wrong
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error during request' }),
    };
  }
};

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const API_BASE_URL = process.env.API_BASE_URL; // Use Netlify environment variables
  const path = event.path.replace('/.netlify/functions/apiProxy', '');
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        Authorization: event.headers.authorization || '',
      },
      body: event.body,
    });
    const data = await response.json();
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from API' }),
    };
  }
};

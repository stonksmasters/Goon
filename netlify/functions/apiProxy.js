const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { path } = event;
    const backendUrl = `https://goonbackend.onrender.com${path.replace('/.netlify/functions/apiProxy', '')}`;
    
    // Make a request to the backend
    const response = await axios({
      method: event.httpMethod,
      url: backendUrl,
      headers: { ...event.headers },
      data: event.body,
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error in apiProxy:', error.message);

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: 'Error in apiProxy',
        details: error.message,
      }),
    };
  }
};
